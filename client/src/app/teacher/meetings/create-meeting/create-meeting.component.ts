import { ActivatedRoute, Router } from "@angular/router";
import { AfterContentInit, Component, OnDestroy, OnInit } from "@angular/core";
import {
   FormBuilder,
   FormControl,
   FormGroup,
   Validators,
} from "@angular/forms";
import { FormsService } from "src/app/services/forms/forms.service";
import { FormsValidatorsService } from "../../../services/forms/forms-validators.service";
import { Student } from "src/app/interfaces/Student";
import {
   timesRange,
   conculateRangeToTime,
   formatDate
} from "../../../services/helpers/time.range";
import { Report } from "src/app/interfaces/Report";
import { ReportsService } from "src/app/services/reports.service";
import { StudentsService } from "src/app/services/students.service";
import { timeList } from "../../../services/helpers/times.list";
import { Subscription } from 'rxjs';

@Component({
   selector: "app-create-meeting",
   templateUrl: "./create-meeting.component.html",
   styleUrls: ["./create-meeting.component.scss"],
})
export class CreateMeetingComponent implements OnInit, AfterContentInit, OnDestroy {

   students: Student[];
   meetingForm: FormGroup;
   timeList: string[];
   subStudents: Subscription
   subValuesChanges: Subscription
   subReport: Subscription

   maxDate: Date = new Date()
   minDate: Date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90)

   constructor(
      private formBuilder: FormBuilder,
      public formsService: FormsService,
      private route: ActivatedRoute,
      private router: Router,
      private reportsService: ReportsService,
      private studentsService: StudentsService
   ) {
      this.students = [];
      this.timeList = timeList(0, 24, 15);
   }

   ngOnInit(): void {
      this.subStudents = this.studentsService.getStudents()
         .subscribe((result) => {
            this.students = result;
         });

      this.meetingForm = this.formBuilder.group({
         studentName: ['', [
            Validators.required
         ]],
         meetingDate: [null, [
            Validators.required,
         ]],
         times: this.formBuilder.group({
            meetingStartTime: ['', []],
            meetingEndTime: ['', []],
         }, { validator: FormsValidatorsService.PositiveTimeRange }),
         meetingActivitis: [null, [
            Validators.required,
            Validators.minLength(5)
         ]],
         meetingComments: [null, []],
      });

      this.checkDateAndAddValidateTime();
   }

   ngAfterContentInit(): void {
      this.setMeetingFormValues();
   }

   onCreateMeeting(): void {
      if (this.meetingForm.invalid) return
      const {
         studentName,
         meetingDate,
         meetingActivitis,
         meetingComments,
         times: { meetingStartTime, meetingEndTime },
      } = this.meetingForm.value;

      const student = this.students.find((s) => s.studentName === studentName)

      const report: Report = {
         studentName: studentName,
         ticketNo: student.ticketNo,
         reportDate: formatDate(meetingDate),
         reportActivitis: meetingActivitis,
         reportStartTime: meetingStartTime,
         reportEndTime: meetingEndTime,
         reportRangeTimne: conculateRangeToTime(
            timesRange(meetingStartTime, meetingEndTime)
         ),
         reportComments: meetingComments,
         parentEmail: student.parentEmail,
      };

      // console.log(report)
      this.reportsService.setReport(report);
      this.router.navigate(["/main/teacher/meeting-new"]);
   }

   getFormControl(controlName: string): FormControl {
      return (
         (this.meetingForm.get(controlName) as FormControl) ||
         (this.meetingForm.controls.times.get(controlName) as FormControl)
      );
   }

   setMeetingFormValues() {
      this.subReport = this.reportsService.getReportChange()
         .subscribe((report) => {
            if (report) {
               this.meetingForm.patchValue({
                  studentName: report.studentName,
                  meetingDate: report.reportDate,
                  meetingActivitis: report.reportActivitis,
                  meetingComments: report.reportComments,
                  times: {
                     meetingStartTime: report.reportStartTime,
                     meetingEndTime: report.reportEndTime,
                  },
               });
            }
         });
   }

   checkDateAndAddValidateTime() {
      this.subValuesChanges = this.getFormControl("meetingDate").valueChanges
         .subscribe((result) => {
            const meetingDate = new Date(result).toLocaleDateString();
            const dateToday = new Date().toLocaleDateString();
            // console.log(meetingDate, dateToday)
            const startTime = this.getFormControl("meetingStartTime");
            const endTime = this.getFormControl("meetingEndTime");
            if (meetingDate === dateToday) {
               startTime.setValidators([
                  Validators.required,
                  FormsValidatorsService.blockOverTime,
               ]);
               endTime.setValidators([
                  Validators.required,
                  FormsValidatorsService.blockOverTime,
               ]);
            } else {
               startTime.setValidators([Validators.required]);
               endTime.setValidators([Validators.required]);
            }
            startTime.updateValueAndValidity();
            endTime.updateValueAndValidity();
         });
   }


   ngOnDestroy(): void {
      this.subStudents.unsubscribe()
      this.subValuesChanges.unsubscribe()
      this.subReport.unsubscribe()
   }


}


