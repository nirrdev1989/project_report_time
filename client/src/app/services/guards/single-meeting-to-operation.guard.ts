import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { ReportsService } from '../reports.service';

@Injectable({
   providedIn: 'root'
})
export class SingleMeetingToOperationGuard implements CanActivate {
   constructor(private reportsService: ReportsService, private router: Router) { }
   canActivate(): boolean {
      if (this.reportsService.getReport()) {
         return true;
      }
      this.router.navigate(['/main/teacher'])
      return false
   }

}
