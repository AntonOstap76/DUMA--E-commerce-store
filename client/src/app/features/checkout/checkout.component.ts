import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { SnackbarService } from '../../core/services/snackbar.service';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/user';
import { every, firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { OrderToCreate, ShippingAddress } from '../../shared/models/order';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatStepper,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CurrencyPipe,
    MatProgressSpinnerModule
   
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit,OnDestroy {

  private stripeService = inject(StripeService);
  addressElement?:StripeAddressElement;
  private snackBar = inject(SnackbarService);
  saveAddress = false;
  private accountService = inject(AccountService);
  private orderService = inject(OrderService);
  cartService = inject(CartService);

  paymentElement?:StripePaymentElement;

  //for stepper control
  completionStatus = signal<{address:boolean, card:boolean, delivery: boolean}>(
    {address:false,card:false,delivery:false}
  )

  confirmationToken?:ConfirmationToken;

  private router = inject(Router);

  loading = false;



  

  async ngOnInit(){
      try {
        this.addressElement=await this.stripeService.createAddressElement();
        // attaches the Address Element to an HTML element with the same  id
        this.addressElement.mount('#address-element');
        this.addressElement.on('change', this.handleAddressChange);
        
        this.paymentElement = await this.stripeService.createPaymentElement();
        this.paymentElement.mount('#payment-element');
        this.paymentElement.on('change', this.handlePaymentChange);

      } catch (error:any) {
        this.snackBar.error(error.message);
      }
  }

 

  //biding to a class 
  handleAddressChange = (event:StripeAddressElementChangeEvent) =>{
    this.completionStatus.update(state=>{
      state.address = event.complete;
      return state;
    })
  }

  handlePaymentChange = (event:StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state=>{
      state.card = event.complete;
      return state;
    })
  }

  handleDeliveryChange(event:boolean){
    this.completionStatus.update(state=>{
      state.delivery= event;
      return state;
    })
  }

  // activate this method on stage 3 ( payment)
  async getConfirmationToken(){
    //checking completion status firstly
  try {
    if(Object.values(this.completionStatus()).every(status =>status === true)){ //return true if all objects inside compStatus is true
      const result = await this.stripeService.createConfirmationToken();
      if (result.error) throw new Error(result.error.message);
      this.confirmationToken = result.confirmationToken;
      console.log("this", this.confirmationToken);
    }
  } catch (error:any) {
    this.snackBar.error(error.message);
  }
    
  }

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress() as Address;
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
    if(event.selectedIndex ===3){
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper:MatStepper){
    this.loading=true;
    try {
      if(this.confirmationToken){
        const result = await this.stripeService.confirmPayment(this.confirmationToken);

        //create order
        if(result.paymentIntent?.status === 'succeeded'){
          const order = await this.createOrderModel();
          const orderResult = await firstValueFrom(this.orderService.createOrder(order));
          if(orderResult){
            this.orderService.orderComplete=true;
            this.cartService.deleteCart();
            this.cartService.selectedDelivery.set(null);
            this.router.navigateByUrl('/checkout/success');
          }else{
            throw new Error('Order creation failed');
          }
        }else if(result.error){
          throw new Error(result.error.message);
        }else{
          throw new Error('Something went wrong')
        }
      }
    } catch (error:any) {
      this.snackBar.error(error.message || 'Something went wrong');
      stepper.previous();
    }finally{
      this.loading=false;
    }
  }
//for structure the order before sending to API
  private async createOrderModel(): Promise<OrderToCreate>{
    const cart = this.cartService.cart();
    const shippingAddress = await this.getAddressFromStripeAddress() as ShippingAddress;
    const card = this.confirmationToken?.payment_method_preview.card;

    if(!cart?.id || !cart.deliveryMethodId || !card || !shippingAddress){

      throw new Error('Problem creating order');
    }

    return{
      cartId:cart.id,
      paymentSummary:
      {
        last4:+card.last4,
        brand:card.brand,
        expMonth:card.exp_month,
        expYear:card.exp_year
      },
      deliveryMethodId:cart.deliveryMethodId,
      shippingAddress
      

    }
  }
  
  private async getAddressFromStripeAddress():Promise<Address| ShippingAddress | null> {
    const result =  await this.addressElement?.getValue();
    const address = result?.value.address;

    if(address){
      return {
        name:result.value.name,
        line1:address.line1,
        line2:address.line2 || undefined,
        city:address.city,
        state:address.state,
        postalCode:address.postal_code,
        country:address.country
       
      }
    }else{
      return null;
    }
  }

  onSaveAddressCheckboxChange(event:MatCheckboxChange){
    this.saveAddress=event.checked;
  }

  ngOnDestroy():void {
      this.stripeService.disposeElements();
  }

  
}
