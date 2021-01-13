import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) : boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.auth.getIsAuthenticated();
    if(!isAuth) {
      this.router.navigate(['/auth/login'])
    }
    return isAuth;
  }

}
