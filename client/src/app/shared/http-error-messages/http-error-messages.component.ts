import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Observable, Subscription } from "rxjs";
import { HttpErrorMessagesService } from "src/app/services/http-error-messages.service";

@Component({
   selector: "app-http-error-messages",
   templateUrl: "./http-error-messages.component.html",
   styleUrls: ["./http-error-messages.component.scss"],
})
export class HttpErrorMessagesComponent implements OnInit, OnDestroy {
   subErrorMessageChange: Subscription;
   message: string = ''

   constructor(
      private httpErrorMessages: HttpErrorMessagesService,
      private cdr: ChangeDetectorRef) { }

   ngOnInit(): void {
      this.subErrorMessageChange = this.httpErrorMessages.getErrorMessageChnage()
         .subscribe((message) => {
            this.cdr.detectChanges()
            this.message = message;
         });
   }

   ngOnDestroy(): void {
      this.subErrorMessageChange.unsubscribe();
   }
}
