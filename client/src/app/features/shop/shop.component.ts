import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    MatCard,
    ProductItemComponent,
    MatButton,
    MatIcon, 

    // for sorting component
    MatMenu,MatSelectionList,MatListOption,MatMenuTrigger
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  private shopService = inject(ShopService);
  //injecting dialog to shopcomponent
  private dialogService = inject(MatDialog);
  products: Product[]=[];

  // for making filters dialog functional
  selectedBrands: string[]=[];
  selectedTypes: string[]=[];

  // for sorting functionality
  selectedSort: string='name';
  sortOptions=[
    {name:'Alphabetical', value:'name'},
    {name:'Price Low-High', value:'priceAsc'},
    {name:'Price High-Low', value:'priceDesc'}
  ]

  ngOnInit(): void {
     this.initializeShop();
  }

  initializeShop(){
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  getProducts(){
    this.shopService.getProducts(this.selectedBrands, this.selectedTypes, this.selectedSort).subscribe({
      next:response=>this.products=response.data, 
      error: error=>console.log(error),
      
    })
  }

 //for sorting 
  onSortChange(event:MatSelectionListChange){

    const selectedOption = event.options[0];

    if (selectedOption){
      this.selectedSort=selectedOption.value;
      this.getProducts();
    }

  }

  //function for opening dialog service
  openFiltersDialog(){
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth:'500px', 
      data:{
        selectedBrands:this.selectedBrands,
        selectedTypes:this.selectedTypes
      }
    });
    dialogRef.afterClosed().subscribe({
      next:result=>{
        if(result){
          this.selectedBrands=result.selectedBrands;
          this.selectedTypes=result.selectedTypes;
          this.getProducts();
          
        }
      }
    })
  }


}
