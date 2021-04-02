import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SignService } from '../sign.service';

@Injectable({
   providedIn: 'root'
})
export class SignGuard implements CanActivate {
   constructor(private signServie: SignService, private router: Router) { }
   canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = state.url.split('/')[3]

      return this.signServie.verifyToken(token)
         .pipe(
            map((result) => {
               if (result) {
                  console.log(result)
                  return true
               } else {
                  alert()
                  this.router.navigate(['/sign/vvv'])
                  return false
               }
            })
         )
   }

}
