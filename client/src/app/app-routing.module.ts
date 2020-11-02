import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./services/guards/auth.guard";
import { NotAuthGuard } from "./services/guards/not-auth.guard";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { ExmpleComponent } from "./shared/exmple/exmple.component";
import { SignGuard } from './services/guards/sign.guard';

const routes: Routes = [
    {
        path: "",
        redirectTo: "auth/email",
        pathMatch: "full",
    },
    {
        path: "confirm-report",
        loadChildren: () => import('./signature/signature.module').then((m) => m.SignatureModule),
        canActivate: [SignGuard]
    },
    // {
    //     path: "",
    //     redirectTo: "x",
    //     pathMatch: "full",
    // },
    // {
    //     path: 'x', component: ExmpleComponent
    // },
    {
        path: "auth",
        loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
        // canActivate: [NotAuthGuard],
    },
    {
        path: "main",
        loadChildren: () => import("./teacher/teacher.module").then((m) => m.TeacerModule),
        canActivate: [AuthGuard],
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
    // {
    //     path: "404",
    // },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
