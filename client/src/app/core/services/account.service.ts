import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, User } from '../../shared/models/user';
import { map, tap } from 'rxjs';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private http = inject(HttpClient);

  // currentUSer either User or null with initial value null
  currentUser = signal<User | null>(null);

  private signalrService = inject(SignalrService);
  isAdmin = computed(()=>{
    const roles = this.currentUser()?.roles;
    return Array.isArray(roles) ? roles.includes('Admin') : roles == 'Admin';
  });

  login(values:any){
    let params =  new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseUrl+'login', values, {params}).pipe(
      tap(()=>this.signalrService.createHubConnection())
    )
  }

  register(values:any){
    return this.http.post(this.baseUrl+'account/register', values);
  }

  getUserInfo(){
    return this.http.get<User>(this.baseUrl+'account/user-info').pipe(
      map(user=>{
        this.currentUser.set(user);
        return user;
      })
    )
  }

  logout(){
    return this.http.post(this.baseUrl+'account/logout', {}).pipe(
      tap(()=>this.signalrService.stopHubConnection())
    );
  }

  updateAddress(address:Address){
    return this.http.post(this.baseUrl+'account/address', address).pipe(

      //tap-just for side effect
      tap(()=>{
        this.currentUser.update(user=>{ //just updating user address
            if(user) user.address = address;
              return user;

        })
      })
    );
  }

  getAuthState(){
    return this.http.get<{isAuthenticated:boolean}>(this.baseUrl+'account/auth-status');
  }
}
