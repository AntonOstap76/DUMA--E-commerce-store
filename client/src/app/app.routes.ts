import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';

export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path:'shop', component: ShopComponent},
    //for opening product details with specified id 
    {path:'shop/:id', component:ProductDetailsComponent},
    {path:'**', redirectTo:'', pathMatch:'full'}
];
