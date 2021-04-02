import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Report } from "src/app/interfaces/Report";
import { LoaderService } from "src/app/services/loader.service";
import { ReportsService } from "src/app/services/reports.service";


@Component({
   selector: "app-single-meeting",
   templateUrl: "./single-meeting.component.html",
   styleUrls: ["./single-meeting.component.scss"],
})
export class SingleMeetingComponent implements OnInit, OnDestroy {
   mode: string = "new-report";
   report: Report;
   sunParams: Subscription;
   subReport: Subscription;

   constructor(
      private route: ActivatedRoute,
      private reportsService: ReportsService,
      private router: Router,
      private loaderService: LoaderService
   ) { }

   ngOnInit(): void {
      this.subReport = this.reportsService.getReportChange()
         .subscribe((report) => this.report = report)

      this.sunParams = this.route.paramMap.subscribe((params: ParamMap) => {
         if (params.has("ticketNo")) {
            this.mode = "resend-sign";
         }
      });
   }

   onSendReport(): void {
      if (this.report) {
         console.log(this.report)
         this.loaderService.setStatus(true);
         this.reportsService.createReport(this.report)
            .subscribe((result) => {
               this.router.navigate(["/main/teacher/meeting-success"]);
               this.loaderService.setStatus(false);
            }, (error) => alert(error?.error?.message));
      }
   }

   onResendSign(): void {
      if (this.report) {
         this.loaderService.setStatus(true);
         this.reportsService.resendParentSign(this.report)
            .subscribe((result) => {
               this.router.navigate(['/main/teacher/meetings-table'])
               this.loaderService.setStatus(false);
            })
      }
   }

   ngOnDestroy(): void {
      this.sunParams.unsubscribe();
      this.subReport.unsubscribe()
   }
}
