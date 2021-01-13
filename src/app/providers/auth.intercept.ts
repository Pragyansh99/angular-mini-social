import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept( req: HttpRequest<any>, next: HttpHandler) {
    console.log('Req => ', req)
    const token = this.auth.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', "Bearer " + token)
    });
    return next.handle(authRequest);
  }

}
