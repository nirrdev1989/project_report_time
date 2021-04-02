import {
   Component,
   OnDestroy,
   OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { map } from 'rxjs/operators';
import { ReportStats } from "src/app/interfaces/Report";
import { ReportsService } from "src/app/services/reports.service";
import { conculatePresent } from "../../../services/helpers/present";

@Component({
   selector: "app-meeting-create-success",
   templateUrl: "./meeting-create-success.component.html",
   styleUrls: ["./meeting-create-success.component.scss"],
})
export class MeetingCreateSuccessComponent implements OnInit, OnDestroy {
   reporstStats: ReportStats;
   currentMount: number;
   progress: string;
   subReportsStats: Subscription;

   constructor(private route: ActivatedRoute, private reportsService: ReportsService) { }
   // { totalHours: '0:45:00', repostsCount: '1', limitHours: '15' }
   ngOnInit(): void {
      // this.subReportsStats = this.route.data
      this.reportsService.getMountlyStats()
         .pipe(
            map((result) => {
               this.currentMount = new Date().getMonth() + 1;
               this.reporstStats = result;
               let limitHoures = this.reporstStats.limitHours;
               let hoursDone = this.reporstStats.totalHours.split(":")[0];
               return conculatePresent(Number(limitHoures), Number(hoursDone))
            })
         ).subscribe((result) => {
            //  console.log(result);
            this.progress = result >= 100 ? `${String(100)}%` : `${String(result)}%`
         });
   }

   resetReportingSeccess() {
      this.reportsService.setReportingSuccess(false)
   }


   ngOnDestroy(): void {
      // this.subReportsStats.unsubscribe();
   }

}
