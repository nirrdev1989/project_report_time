import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { map, switchMap } from 'rxjs/operators';
import { Report } from "src/app/interfaces/Report";
import { Student } from "src/app/interfaces/Student";
import { ReportsService } from "src/app/services/reports.service";
import { StudentsService } from 'src/app/services/students.service';
import { daysRange } from "../../../services/helpers/time.range";


@Component({
   selector: "app-meeting-table",
   templateUrl: "./meeting-table.component.html",
   styleUrls: ["./meeting-table.component.scss"],
})
export class MeetingTableComponent implements OnInit, OnDestroy {
   students: Student[];
   reports: Report[];
   studentSelected: string;
   subInfo: Subscription;

   constructor(
      private router: Router,
      private reportsService: ReportsService,
      private studentsService: StudentsService) {
      this.students = [];
      this.reports = [];
   }

   ngOnInit(): void {
      this.subInfo = this.studentsService.getStudents().pipe(
         switchMap((result) => {
            this.students = result
            return this.reportsService.getReportsChange()
         }),
         map((result) => {
            this.reports = result;
            this.students.forEach((s) => {
               let findReports = this.reports.find((r) => r.ticketNo == s.ticketNo)
               if (findReports) {
                  s.hasReports = true
               }
            })
         })
      ).subscribe()
   }


   onSelectStudent(event: any): void {
      this.studentSelected = event.value
   }


   getReportSignAgain(report: Report): void {
      const student = this.students.find((s) => s.ticketNo === report.ticketNo);
      if (student) {
         report.studentName = student.studentName;
         report.parentEmail = student.parentEmail;

         this.reportsService.setReport(report);

         this.router.navigate(["/main/teacher/meeting", report.ticketNo], {
            queryParams: {
               date: report.reportDate,
               time: report.reportStartTime
            }
         });

      }
   }

   anableResendParentSign(date: string, rangeLimit: number): boolean {
      const now = new Date().getTime()
      const last = new Date(date).getTime()
      if (daysRange(now, last) < rangeLimit) {
         return true
      }
      return false
   }

   ngOnDestroy(): void {
      this.subInfo.unsubscribe();
   }
}
