import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";

import {
   HttpRequest,
   HttpHandler,
   HttpEvent,
   HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { HttpErrorMessagesService } from "../http-error-messages.service";


@Injectable()
export class HttpErrorMessagesInterceptor implements HttpInterceptor {
   constructor(
      private httpErrorMessagesService: HttpErrorMessagesService,
   ) { }

   intercept(
      request: HttpRequest<unknown>,
      next: HttpHandler
   ): Observable<HttpEvent<unknown>> {
      return next.handle(request).pipe(
         tap((result) => {
            // console.log(result, 'SUCCESS')
         }),
         catchError((error) => {
            this.httpErrorMessagesService.checkErrorMessage(error)
            return throwError(error);
         })
      );
   }
}
