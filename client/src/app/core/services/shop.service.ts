import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'https://localhost:5001/api/'

  private http = inject(HttpClient);

  // because service is singelton 
  //for storing types and brands for filtering
  types : string []=[];
  brands: string [] = [];

  getProducts(shopParams:ShopParams){
// effectively allow to built a query string
    let params=new HttpParams();

// cheking if user choose filter
    if(shopParams.brands.length>0){
       params=params.append('brands', shopParams.brands.join(','))
    }

    if(shopParams.types.length>0){
      params=params.append('types', shopParams.types.join(','))
   }

// cheking if user choose sort type
   if(shopParams.sort){
    params=params.append('sort',shopParams.sort);
   }

   params=params.append('pageSize', 20);

    return this.http.get<Pagination<Product>>(this.baseUrl+'products', {params})
  }

  // for getting a brand
  getBrands(){
    //then just returning data from service
    if(this.brands.length>0) return;

    // execute it once 
    return this.http.get<string[]>(this.baseUrl+'products/brands').subscribe({
      next: response=>this.brands=response
    })
  }

  // for getting a types
  getTypes(){

    //then just returning data from service
    if(this.types.length>0) return ;

    // execute it once
    return this.http.get<string[]>(this.baseUrl+'products/types').subscribe({
      next: response=>this.types=response
    })
  }
}
