import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ConfirmCode } from "src/app/interfaces/ConfirmCode";
import { AuthService } from "src/app/services/auth.service";
import { LoaderService } from "src/app/services/loader.service";
import { FormsService } from "../../services/forms/forms.service";

@Component({
   selector: "app-confirm",
   templateUrl: "./confirm.component.html",
   styleUrls: ["./confirm.component.scss"],
})
export class ConfirmComponent implements AfterViewInit, OnDestroy, OnInit {

   isValidTime: boolean = true
   confirmCodeExpireTime: number
   subFormChange: Subscription
   subTimer: Subscription


   @ViewChild('form') form: NgForm
   @ViewChild('first') firstInput: ElementRef

   constructor(
      public formsService: FormsService,
      private authService: AuthService,
      private router: Router,
      private loaderService: LoaderService) { }


   ngOnInit(): void {
      this.confirmCodeExpireTime = this.authService.getConfimCodeExpire()
      this.setTimer(this.confirmCodeExpireTime)
   }


   ngAfterViewInit(): void {
      this.subFormChange = this.form.valueChanges.subscribe((result) => {
         if (this.form.invalid) return
         else if (this.form.valid) {
            let code: string = "";

            for (const num in this.form.value) {
               code += this.form.value[num]
            }

            const codeToSend: ConfirmCode = {
               code: code
            };

            this.loaderService.setStatus(true)
            this.authService.confirmCode(codeToSend.code)
               .subscribe((result) => {
                  this.router.navigate(["main/teacher"])
                  this.form.resetForm()
               }, () => {
                  this.form.resetForm()
                  this.firstInput.nativeElement.focus()
                  this.firstInput.nativeElement.blur()
               });
         }
      })
   }


   onResendConfirmCode(): void {
      this.loaderService.setStatus(true)
      this.setTimer(this.confirmCodeExpireTime)
      this.authService.resendConfirmCode().subscribe((result) => {
         this.form.resetForm()
         alert(result)
      });
   }


   onClear(): void {
      this.form.resetForm()
   }


   setTimer(limit: number): void {
      this.subTimer = interval(1000)
         .pipe(
            takeWhile((result) => result <= limit)
         )
         .subscribe((result) => {
            this.isValidTime = result === this.confirmCodeExpireTime ? false : true
         })
   }


   ngOnDestroy(): void {
      this.subFormChange.unsubscribe()
      this.subTimer.unsubscribe()
   }
}
