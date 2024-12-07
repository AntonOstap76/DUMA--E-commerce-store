import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  // own function to open snackbar
  error(message: string ){

    // {} brakets for configuratipn
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass:['snack-error']// name of class in style.css to style this snackBAr
    })
  }

  success(message: string ){

    // {} brakets for configuratipn
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass:['snack-success']// name of class in style.css to style this snackBAr
    })
  }

  
}
