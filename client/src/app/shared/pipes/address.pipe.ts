import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken} from '@stripe/stripe-js';
import { ShippingAddress } from '../models/order';

@Pipe({
  name: 'address',
  standalone: true
})

// for transforming data from confirmation token to accepted data 
export class AddressPipe implements PipeTransform {

// compatible with own type for shipping address
  transform(value?: ConfirmationToken['shipping'] | ShippingAddress, ...args: unknown[]): unknown {
    if(value && 'address' in value && value.name){
      const {line1,line2,city,state,country,postal_code} = (value as ConfirmationToken['shipping'])?.address!;
      return `${value?.name}, ${line1}${line2 ? ', '+line2 : ''} ,
               ${city}, ${state}, ${postal_code}, ${country}`;
               
    }else if(value && 'line1' in value){//for shipping address
      const {line1,line2,city,state,country,postalCode} = value as ShippingAddress;
      return `${value?.name}, ${line1}${line2 ? ', '+line2 : ''} ,
               ${city}, ${state}, ${postalCode}, ${country}`;
    }else{
      return 'Uknown address';
    }
  }

}
