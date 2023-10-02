import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class NoConnectedGuard implements CanActivate {

  constructor(
    private apiService: ApiService,
    private router: Router,
  ){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let token = this.apiService.getToken();
      if(token !== null && token !== undefined && token !== ''){
        this.router.navigate(['work']);
        return false;
      }
      return true;
  }
  
}
