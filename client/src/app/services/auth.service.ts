import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
// import { RoutingService } from './routing.service';


@Injectable({
   providedIn: "root",
})
export class AuthService {

   private baseUrl: string
   private tokenTimer: NodeJS.Timer;
   private authProccess: boolean
   private authProccessChnage: BehaviorSubject<boolean>
   private confirmCodeExpireTime: number


   constructor(private http: HttpClient, private router: Router) {
      this.baseUrl = 'api/v1/auth'
      this.authProccess = false
      this.authProccessChnage = new BehaviorSubject<boolean>(this.authProccess)
   }

   getConfimCodeExpire(): number {
      return this.confirmCodeExpireTime
   }

   getAuthProccessChange(): Observable<boolean> {
      return this.authProccessChnage.asObservable()
   }

   getUserName(): string {
      return this.getSessionStorage('user-name') || ''
   }


   getCompanyContent() {
      return this.getSessionStorage('company-content') || 'אין הודעה חשובה'
   }

   // GET CHECK USER IS LOGIN
   checkUserIsLogged(): Observable<{ isLog: boolean }> {
      return this.http.get<{ isLog: boolean }>(`${this.baseUrl}/userIsLogged`)
         .pipe(
            map((result) => {
               return { isLog: result.isLog }
            })
         )
   }

   // GET LOGOUT USER
   logout(): void {
      this.http.get<{ message: string }>(`${this.baseUrl}/logout`)
         .pipe(
            tap((result) => {
               this.router.navigate(["/auth/user"])
            })
         ).subscribe()
   }


   // POST AUTH TEACHER EMAIL 
   authTeacherEmail(teacherEmail: string): Observable<string> {
      return this.http
         .post<{
            message: string;
            confirmCodeExpire: number;
         }>(`${this.baseUrl}/teacherEmail`, { teacherEmail: teacherEmail })
         .pipe(
            map((result) => {
               if (result) {
                  this.confirmCodeExpireTime = result.confirmCodeExpire
                  this.authProccess = true
                  this.authProccessChnage.next(this.authProccess)
               }
               return result.message;
            })
         );
   }

   // POST AUTH TEACHER CONFIRM CODE 
   confirmCode(code: string): Observable<string> {
      return this.http
         .post<{
            message: string;
            isLog: boolean;
            tokenExpiresIn: number;
            userName: string
            companyContent: string
         }>(
            `${this.baseUrl}/confirm-code`, { code: code },
            //  { withCredentials: true }
         )
         .pipe(
            map((result) => {
               this.setSessionStorage('user-name', result.userName)
               this.setSessionStorage('company-content', result.companyContent)

               this.setTokenTimer(result.tokenExpiresIn)

               this.authProccess = false
               this.authProccessChnage.next(this.authProccess)

               return result.message
            })
         );
   }

   // GER NEW CONFIRM CODE 
   resendConfirmCode(): Observable<string> {
      return this.http
         .get<{
            message: string;
            confirmCodeExpire: number;
         }>(`${this.baseUrl}/new-confirm-code`,
         //  { withCredentials: true }
      )
         .pipe(
            map((result) => {
               this.confirmCodeExpireTime = result.confirmCodeExpire
               return result.message;
            })
         );
   }

   setSessionStorage(key: string, val: any): void {
      sessionStorage.setItem(key, JSON.stringify(val));
   }

   removeSessionStorage(key: string): void {
      sessionStorage.removeItem(key)
   }

   getSessionStorage(key: string) {
      return JSON.parse(sessionStorage.getItem(key))
   }

   clearLoginInfo() {
      this.removeSessionStorage('user-name')
      this.removeSessionStorage('company-content')
      this.clearTimer()
      this.logout()
   }

   setTokenTimer(time: number): void {
      this.tokenTimer = setTimeout(() => {
         this.clearLoginInfo();
      }, time * 1000);
   }

   clearTimer() {
      clearTimeout(this.tokenTimer)
   }

}












