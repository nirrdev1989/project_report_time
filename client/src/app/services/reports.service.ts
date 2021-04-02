import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Report, ReportStats } from "../interfaces/Report";
import { formatDate } from "../services/helpers/time.range"

@Injectable({
   providedIn: "root",
})
export class ReportsService {
   private report: Report;
   private reports: Report[]
   private reportsChange: BehaviorSubject<Report[]>
   private reportChange: BehaviorSubject<Report>
   private reportingSuccess: boolean = false


   constructor(private http: HttpClient, private router: Router) {
      this.reports = []
      this.report = null
      this.reportChange = new BehaviorSubject<Report>(this.report)
      this.reportsChange = new BehaviorSubject<Report[]>(this.reports)
   }


   getReportsChange(): Observable<Report[]> {
      return this.reportsChange.asObservable()
   }


   getReportChange(): Observable<Report> {
      return this.reportChange.asObservable()
   }

   getReportingSuccess(): boolean {
      return this.reportingSuccess
   }

   setReportingSuccess(status: boolean): void {
      this.reportingSuccess = status
   }

   setReport(report: Report): void {
      this.report = { ...report };
      this.reportChange.next(this.report)
   }


   getReport(): Report {
      return this.report || undefined
   }


   // POST TEACHER CREATE REPORT
   createReport(report: Report): Observable<string> {
      return this.http.post<{
         message: string,
         index: number,
         tokenExpiresIn: number
      }>('api/teacher/create-report', report)
         .pipe(
            map((result) => {
               console.log(result, report)
               this.setReportingSuccess(true)
               report.index = result.index
               report.lastDateResendSignToParent = formatDate(new Date())
               this.reports.push(report)
               this.reportsChange.next([...this.reports])
               return result.message
            })
         )
   }

   // GET TEACHER STATS
   getMountlyStats(): Observable<ReportStats> {
      return this.http.get<{ tokenExpiresIn: number, toJson: ReportStats }>('api/teacher/reports/stats')
         .pipe(
            map((result) => {
               return result.toJson
            })
         )
   }

   // GET TEACHER UNCINFIRM REPORTS
   getReportsNotConfirm(): Observable<Report[]> {
      if (this.reports.length > 0) {
         return of(this.reports);
      }
      return this.http.get<{ tokenExpiresIn: number, toJson: Report[] }>("api/teacher/reports-unconfirm")
         .pipe(
            tap((result: any) => {
               this.reports = result.toJson;
               this.reportsChange.next([...this.reports])
            })
         );

   }


   // POST TEACHER RESEND EMAIL TO PARENT FOR CONFIRM REPORT 
   resendParentSign(report: Report): Observable<string> {
      const reportInfo = {
         studentName: report.studentName,
         parentEmail: report.parentEmail,
         ticketNo: report.ticketNo,
         reportDate: report.reportDate,
         index: Number(report.index),
      }
      return this.http.post<{
         message: string,
         tokenExpiresIn: number
      }>('api/teacher/resend/parent-sign', reportInfo)
         .pipe(
            map((result) => {
               const findIndex = this.reports.findIndex((r) => r.index == report.index)
               report.lastDateResendSignToParent = formatDate(new Date())
               this.reports[findIndex] = report
               this.reportsChange.next([...this.reports])
               return result.message
            })
         )
   }

}
