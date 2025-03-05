import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router); 
  const snackBar= inject(SnackbarService);

  return next(req).pipe(
    catchError((err:HttpErrorResponse)=>{
      if (err.status === 400){
        // for validation error
        if (err.error.errors){
          const modelStateErrors = [];
          for(const key in err.error.errors ){
            if(err.error.errors[key]){
              //push the value of val error to model state array
              modelStateErrors.push(err.error.errors[key])
            }
          }
          throw modelStateErrors.flat();
        }
        else{
          snackBar.error(err.error.title || err.error)
        }
        
      }
      if (err.status === 401){
        snackBar.error(err.error.title || err.error)
      }
      if (err.status === 403){
        snackBar.error('Forbidden')
      }
      if (err.status === 404){
        router.navigateByUrl('/not-found'); // navigate to not found page
      }
      if(err.status === 500){
        const navigationExtras: NavigationExtras={state:{error:err.error}}
        //contain error response  
        router.navigateByUrl('/server-error', navigationExtras);
      }
      return throwError(()=>err)
    })
  )
};
