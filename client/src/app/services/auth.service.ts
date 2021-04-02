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

   private tokenTimer: NodeJS.Timer;
   private authProccess: boolean
   private authProccessChnage: BehaviorSubject<boolean>
   private confirmCodeExpireTime: number

   constructor(private http: HttpClient, private router: Router) {
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
      return this.http.get<{ isLog: boolean }>("api/auth/userIsLogged")
         .pipe(
            map((result) => {
               return { isLog: result.isLog }
            })
         )
   }

   // GET LOGOUT USER
   logout(): void {
      this.http.get<{ message: string }>("api/auth/logout")
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
         }>("api/auth/teacherEmail", { teacherEmail: teacherEmail })
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
            "api/auth/confirm-code", { code: code },
            //  { withCredentials: true }
         )
         .pipe(
            map((result) => {
               console.log(result)
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
         }>("api/auth/new-confirm-code",
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










// private isLog: boolean;
// private isLogChange: BehaviorSubject<boolean>;
// private token: string;
// private tokenTimer: NodeJS.Timer;
// private userName: string
// private authProccess: boolean
// private authProccessChnage: BehaviorSubject<boolean>
// private confirmCodeExpireTime: number

// constructor(private http: HttpClient, private router: Router) {
//    this.isLog = false;
//    this.isLogChange = new BehaviorSubject<boolean>(this.isLog);
//    this.authProccess = false
//    this.authProccessChnage = new BehaviorSubject<boolean>(this.authProccess)
// }

// // getToken(): string {
// //    return this.token;
// // }

// // getIsLog(): boolean {
// //    return this.isLog;
// // }

// getUserName(): string {
//    return this.userName;
// }

// getConfimCodeExpire(): number {
//    return this.confirmCodeExpireTime
// }

// getIsLogChange(): Observable<boolean> {
//    return this.isLogChange.asObservable();
// }

// getAuthProccessChange(): Observable<boolean> {
//    return this.authProccessChnage.asObservable()
// }

// getCompanyContent() {
//    return JSON.parse(localStorage.getItem('company-content')) || ''
// }

// getAuthData(): void {
//    const authData = this.getSessionStorage();

//    if (!authData) {
//       return this.clearLoginInfo();
//    }

//    const now = new Date();
//    const isValidTime = authData.expiresInDate.getTime() - now.getTime();

//    // console.log(isValidTime, "IS TOKEN VALID TIME");

//    if (isValidTime > 0) {
//       // console.log('IS LOG')
//       this.token = authData.token;
//       this.userName = authData.userName;
//       this.isLog = true;
//       this.isLogChange.next(this.isLog);
//       this.setTokenTimer(isValidTime / 1000);
//    } else {
//       this.clearLoginInfo();
//    }
// }

// checkUserIsLogged(): Observable<any> {
//    return this.http.get("api/auth/userIsLogged")
// }

// logout(): void {
//    this.http.get("api/auth/logout").subscribe()
// }


// // POST AUTH TEACHER EMAIL 
// authTeacherEmail(teacherEmail: string): Observable<string> {
//    return this.http
//       .post<{
//          message: string;
//          confirmCodeExpire: number;
//       }>("api/auth/teacherEmail", { teacherEmail: teacherEmail })
//       .pipe(
//          map((result) => {
//             if (result) {
//                this.confirmCodeExpireTime = result.confirmCodeExpire
//                this.authProccess = true
//                this.authProccessChnage.next(this.authProccess)
//             }
//             return result.message;
//          })
//       );
// }

// // POST AUTH TEACHER CONFIRM CODE 
// confirmCode(code: string): Observable<string> {
//    return this.http
//       .post<{
//          message: string;
//          isLog: boolean;
//          token: string;
//          tokenExpiresIn: number;
//          userName: string
//          companyContent: string
//       }>(
//          "api/auth/confirm-code", { code: code }, { withCredentials: true })
//       .pipe(
//          map((result) => {
//             // this.userName = result.userName
//             // this.isLog = result.isLog;
//             // this.isLogChange.next(this.isLog);

//             // const expiresIn = result.tokenExpiresIn;

//             // this.token = result.token;

//             // this.setTokenTimer(expiresIn);

//             // const now = new Date();
//             // const expiresInDate = new Date(now.getTime() + expiresIn * 1000);

//             // this.saveSessionStorage(this.token, expiresInDate, this.userName);
//             // this.saveToLocalStorage('company-content', result.companyContent)

//             // setTimeout(() => {
//             this.authProccess = false
//             this.authProccessChnage.next(this.authProccess)
//             // }, 1500);

//             return result.message
//          })
//       );
// }

// // GER NEW CONFIRM CODE 
// resendConfirmCode(): Observable<string> {
//    return this.http
//       .get<{
//          message: string;
//          confirmCodeExpire: number;
//       }>("api/auth/new-confirm-code", { withCredentials: true })
//       .pipe(
//          map((result) => {
//             this.confirmCodeExpireTime = result.confirmCodeExpire
//             return result.message;
//          })
//       );
// }


// // private saveSessionStorage(
// //    token: string,
// //    expiresIn: Date,
// //    userName: string
// // ): void {
// //    sessionStorage.setItem("token", token);
// //    sessionStorage.setItem("expiresIn", expiresIn.toISOString());
// //    sessionStorage.setItem("user-name", JSON.stringify(userName));
// // }

// // private removeSessionStorage(): void {
// //    sessionStorage.removeItem("token");
// //    sessionStorage.removeItem("expiresIn");
// //    sessionStorage.removeItem("user-name");
// // }

// // private getSessionStorage() {
// //    const token = sessionStorage.getItem("token");
// //    const expiresInDate = sessionStorage.getItem("expiresIn");
// //    const userName = JSON.parse(sessionStorage.getItem("user-name"));

// //    if (!token || !expiresInDate) {
// //       return;
// //    }

// //    return {
// //       token: token,
// //       expiresInDate: new Date(expiresInDate),
// //       userName: userName,
// //    };
// // }

// // private saveToLocalStorage(key: string, value: any) {
// //    localStorage.setItem(key, JSON.stringify(value))
// // }

// // clearLoginInfo(): void {
// //    this.token = null;
// //    this.isLog = false;
// //    this.userName = null;
// //    this.isLogChange.next(this.isLog);
// //    clearTimeout(this.tokenTimer);
// //    this.logout()
// //    this.removeSessionStorage();
// // }

// // private setTokenTimer(time: number): void {
// //    this.tokenTimer = setTimeout(() => {
// //       this.clearLoginInfo();
// //       this.router.navigate(["/auth/user"]);
// //    }, time * 1000);
// // }
