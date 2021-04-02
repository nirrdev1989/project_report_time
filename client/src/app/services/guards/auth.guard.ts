import { Injectable } from "@angular/core";
import {
   CanActivate,
   ActivatedRouteSnapshot,
   RouterStateSnapshot,
   Router,
   CanLoad,
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../auth.service";

@Injectable({
   providedIn: "root",
})
export class AuthGuard implements CanLoad {
   constructor(private authService: AuthService, private router: Router) { }
   canLoad(
      // next: ActivatedRouteSnapshot,
      // state: RouterStateSnapshot
   ): Observable<boolean> | boolean {

      return this.authService.checkUserIsLogged()
         .pipe(
            map((result) => {
               if (result.isLog) {
                  return true
               } else {
                  this.router.navigate(["/auth/user"]);
                  return false
               }
            })
         )
   }
}

