import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButton, MatIcon, MatFormField, MatInput, MatLabel, MatDivider,
    FormsModule //for two way binding
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
  private shopService = inject(ShopService) ;
  private activatedRoute = inject(ActivatedRoute);
  private cartServise = inject(CartService);
  product?: Product;
  quantityInCart = 0;
  quantity = 1;

  ngOnInit(): void {
      this.loadProduct();
  }
  //load a product
  loadProduct(){
    //from activatedroute 
    const id = this.activatedRoute.snapshot.paramMap.get('id'); // "id" should match what is in approutes
    if(!id) return;

    // casting id into number by add + 
    this.shopService.getProduct(+id).subscribe({
      //{}-posibility to add more than 1 statement
      next: product=>{ 
        this.product=product;
        this.updateQuantityInCart();
      },
      error: error=>console.log(error)
    })
  }

  updateCart(){
    if(!this.product) return ;

    if(this.quantity > this.quantityInCart){
      const itemsToAdd=this.quantity-this.quantityInCart;
      this.quantityInCart+=itemsToAdd;
      this.cartServise.addItemToCart(this.product, itemsToAdd);

    }
    else{
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartServise.removeItemFromCart(this.product.id, itemsToRemove);
    }

  }

  updateQuantityInCart(){
    this.quantityInCart = this.cartServise.cart()?.items
    .find(x=>x.productId === this.product?.id)?.quantity || 0;

    this.quantity = this.quantityInCart || 1;
  }

  getButtonText(){
    return this.quantityInCart>0 ? 'Update cart' : 'Add to cart';
  }

}
