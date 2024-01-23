import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { NotificationComponent } from './notification/notification.component';
import { CommentComponent } from './comment/comment.component';


const routes: Routes = [
    {path: "", component: NotificationComponent, canActivate: [AuthGuard]},
    {path: "comment/:id", component: CommentComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
