import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';
import { Report } from 'src/app/interfaces/Report';
import { MeetingsService } from 'src/app/services/meetings.service';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
    selector: 'app-single-meeting',
    templateUrl: './single-meeting.component.html',
    styleUrls: ['./single-meeting.component.scss']
})
export class SingleMeetingComponent implements OnInit, OnDestroy {
    mode: string = 'new-report'
    report: Report
    sunParams: Subscription

    constructor(
        private route: ActivatedRoute,
        private teacherService: TeacherService,
        private meetingsService: MeetingsService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.report = this.meetingsService.getReportCreated()
        this.sunParams = this.route.paramMap.subscribe((params: ParamMap) => {
            if (params.has('ticketNo')) {
                this.mode = 'resend-sign'
            }
        })
    }


    onSendReport(): void {
        if (this.report) {
            this.teacherService.createReport(this.report)
                .subscribe((result) => {
                    console.log(result)
                    this.router.navigate(['/main/teacher/meeting-success'])
                })
        }
    }


    onResendSign(): void {
        if (this.report) {

        }
    }

    ngOnDestroy(): void {
        this.sunParams.unsubscribe()
    }

}
