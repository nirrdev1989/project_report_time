import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateMeetingComponent } from "./meetings/create-meeting/create-meeting.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MeetingCreateSuccessComponent } from "./meetings/meeting-create-success/meeting-create-success.component";
import { MeetingTableComponent } from "./meetings/meeting-table/meeting-table.component";
import { SingleMeetingComponent } from "./meetings/single-meeting/single-meeting.component";
import { TeacherMainComponent } from "./teacher-main/teacher-main.component";
import { SingleMeetingToOperationGuard } from '../services/guards/single-meeting-to-operation.guard';
import { ReportingSuccessGuard } from "../services/guards/reporting-success.guard";


const routes: Routes = [
   {
      path: "teacher",
      component: TeacherMainComponent,
      // resolve: {
      //     reports: ReportsResolverService,
      //     students: StudentsResolverService
      // },
      children: [
         {
            path: "",
            component: DashboardComponent,
         },
         {
            path: "create-meeting",
            component: CreateMeetingComponent,
         },
         {
            path: "meeting-new",
            component: SingleMeetingComponent,
            canActivate: [SingleMeetingToOperationGuard]
         },
         {
            path: "meetings-table",
            component: MeetingTableComponent,
         },
         {
            path: "meeting/:ticketNo",
            component: SingleMeetingComponent,
            canActivate: [SingleMeetingToOperationGuard]
         },
         {
            path: "meeting-success",
            component: MeetingCreateSuccessComponent,
            canActivate: [ReportingSuccessGuard],
         }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class TeacherRoutingModule { }
