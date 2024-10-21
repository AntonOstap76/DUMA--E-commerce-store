import { Component, inject } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { MatDivider } from '@angular/material/divider';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters-dialog',
  standalone: true,
  imports: [
    MatDivider,
    MatSelectionList,
    MatListOption,
    MatButton, 
    //for two way  binding
    FormsModule
  ],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss'
})
export class FiltersDialogComponent {
  //importing for getting data to do filtering
  shopService = inject(ShopService);

  //to accsess MatDialogRef
  private dialogRef = inject(MatDialogRef<FiltersDialogComponent>);
  //for holding data
  data=inject(MAT_DIALOG_DATA)

  selectedBrands:string[]=this.data.selectedBrands;
  selectedTypes:string[]=this.data.selectedTypes;

  //closing filter dialog by applying the filter
  applyFilters(){
    this.dialogRef.close({
      selectedBrands:this.selectedBrands,
      selectedTypes:this.selectedTypes
    })
  }
}
