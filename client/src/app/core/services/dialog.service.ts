import { inject, Injectable } from '@angular/core';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialog = inject(MatDialog);

  confirm(title:string, message:string){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{width:'400px', data:{title,message}});

    return firstValueFrom(dialogRef.afterClosed());
 }
}
