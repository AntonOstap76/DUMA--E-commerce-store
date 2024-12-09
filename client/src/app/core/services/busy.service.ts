import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
//for understanfing if something is loading
export class BusyService {

  loading=false;
  busyRequestCount=0;

  busy(){
    this.busyRequestCount++;
    this.loading=true;

  }

  idle(){
    this.busyRequestCount--;
    if(this.busyRequestCount <=0){
      this.busyRequestCount=0;
      this.loading=false;
    }
  }
}
