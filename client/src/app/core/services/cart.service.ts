import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../../shared/models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  // signal for cart
  cart=signal<Cart | null> (null);

  //methods for get and set a card

  getCart(id:string){
    return this.http.get<Cart>(this.baseUrl+'cart?id='+id).subscribe({
      //set signals
      next: cart=>this.cart.set(cart)
    })
  }

  setCart(cart:Cart){
    return this.http.post<Cart>(this.baseUrl+'cart', cart).subscribe({
      next: cart=> this.cart.set(cart)
    })
  }
}
