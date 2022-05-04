import { AuthService } from './../../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementGuard implements CanActivate {
  constructor(
    private authSv: AuthService
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let isManager = false;
    if(this.authSv.user.role?.includes(4) || this.authSv.user.role?.includes(4)) isManager=true;
    return isManager;
  }
  
}
