import { Injectable } from '@angular/core';
import {
   HttpRequest,
   HttpHandler,
   HttpEvent,
   HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs/operators';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

   constructor(private authService: AuthService) { }

   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

      //   const token = this.authService.getToken() && sessionStorage.getItem('token')
      // console.log(token)

      return next.handle(this.cloneToken(request)).pipe(
         tap((res: any) => {
            if (res.confirmCodeExpire) {
               this.authService.clearTimer()
               this.authService.setTokenTimer(res.confirmCodeExpire)
            }
            // console.log(res)
         })
      )
   }

   private cloneToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
      return request.clone({
         // setHeaders: {
         //    //  'Authorization': 'Bearer ' + token,
         // },
         withCredentials: true
      })
   }
}
