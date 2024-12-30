import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private cartService = inject(CartService);

  init(){
    const cartId = localStorage.getItem('cart_id');
    // of- returning observable of something
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null); 

    return cart$;

  }
}