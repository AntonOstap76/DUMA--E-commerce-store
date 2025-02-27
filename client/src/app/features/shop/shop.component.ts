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
import { ShopParams } from '../../shared/models/shopParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    MatCard,
    ProductItemComponent,
    MatButton,
    MatIcon,
    // for sorting component
    MatMenu, MatSelectionList, MatListOption, MatMenuTrigger,
    // for pagination
    MatPaginator,
    //for searching
    FormsModule,
    EmptyStateComponent
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  private shopService = inject(ShopService);
  //injecting dialog to shopcomponent
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>;

  sortOptions=[
    {name:'Alphabetical', value:'name'},
    {name:'Price Low-High', value:'priceAsc'},
    {name:'Price High-Low', value:'priceDesc'}
  ]

  //initiating object
  shopParams=new ShopParams();

  // for pagination in template
  pageSizeOptions=[5,10,15,20];

  ngOnInit(): void {
     this.initializeShop();
  }

  initializeShop(){
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  resetFilters(){
    this.shopParams = new ShopParams();
    this.getProducts();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
      next:response=>this.products=response, 
      error: error=>console.log(error),
      
    })
  }

// setting search in shopParams via FormsModuls
  onSearchChanged(){
    this.shopParams.pageNumber=1;
    this.getProducts();
  }

  //implementation for template function
  handlePageEvent(event:PageEvent){
    this.shopParams.pageNumber = event.pageIndex+1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

 //for sorting 
  onSortChange(event:MatSelectionListChange){

    const selectedOption = event.options[0];

    if (selectedOption){
      this.shopParams.sort=selectedOption.value;
      //putting user on first page
      this.shopParams.pageNumber=1;
      this.getProducts();
    }

  }

  //function for opening dialog service
  openFiltersDialog(){
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth:'500px', 
      data:{
        selectedBrands:this.shopParams.brands,
        selectedTypes:this.shopParams.types
      }
    });
    dialogRef.afterClosed().subscribe({
      next:result=>{
        if(result){
          this.shopParams.brands=result.selectedBrands;
          this.shopParams.types=result.selectedTypes;
          //putting user on first page
          this.shopParams.pageNumber=1;
          this.getProducts();
          
        }
      }
    })
  }


}
