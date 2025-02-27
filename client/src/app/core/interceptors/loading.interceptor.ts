import { HttpInterceptorFn } from '@angular/common/http';
import { delay, finalize, identity } from 'rxjs';
import { BusyService } from '../services/busy.service';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

//for loading flag
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const busyService = inject(BusyService);

  busyService.busy();

  return next(req).pipe(
    (environment.production ? identity : delay(500)), 
    //after request complited 
    finalize(()=>busyService.idle())
  );
};
