import { HttpInterceptorFn } from '@angular/common/http';
import { delay, finalize } from 'rxjs';
import { BusyService } from '../services/busy.service';
import { inject } from '@angular/core';

//for loading flag
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const busyService = inject(BusyService);

  busyService.busy();

  return next(req).pipe(
    delay(500),
    //after request complited 
    finalize(()=>busyService.idle())
  );
};
