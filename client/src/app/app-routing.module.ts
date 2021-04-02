import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./services/guards/auth.guard";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { SignGuard } from './services/guards/sign.guard';

const routes: Routes = [
   {
      path: "auth",
      loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
      // canActivate: [NotAuthGuard],
   },
   {
      path: "confirm-report",
      loadChildren: () => import('./signature/signature.module').then((m) => m.SignatureModule),
      canActivate: [SignGuard]
   },
   {
      path: "main",
      loadChildren: () => import("./teacher/teacher.module").then((m) => m.TeacerModule),
      canLoad: [AuthGuard],
   },
   {
      path: "",
      redirectTo: "auth/user",
      pathMatch: "full",
   },
   {
      path: 'not-found',
      component: NotFoundComponent,

   },
   {
      path: "**",
      redirectTo: 'not-found',
      pathMatch: 'full'
   },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule],
})
export class AppRoutingModule { }
