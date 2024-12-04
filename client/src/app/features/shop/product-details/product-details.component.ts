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

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButton, MatIcon, MatFormField, MatInput, MatLabel, MatDivider,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
  private shopService = inject(ShopService) ;
  private activatedRoute = inject(ActivatedRoute);
  product?: Product;

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
      next: product=> this.product=product,
      error: error=>console.log(error)
    })
  }

}
