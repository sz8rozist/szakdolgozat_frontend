import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'not-found', component: NotFoundComponent },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
    import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'trainer',
    loadChildren: () =>
    import('./trainer/trainer.module').then((m) => m.TrainerModule)
  },
  {
    path: 'diet',
    loadChildren: () =>
    import('./diet/diet.module').then((m) => m.DietModule)
  },
  {
    path: 'notification',
    loadChildren: () =>
    import('./notification/notification.module').then((m) => m.NotificationModule)
  },
  {
    path: 'workout',
    loadChildren: () =>
    import('./workout/workout.module').then((m) => m.WorkoutModule)
  },
  {
    path: 'chat',
    loadChildren: () =>
    import('./chat/chat.module').then((m) => m.ChatModule)
  },
  {
    path: 'calendar',
    loadChildren: () =>
    import('./calendar/calendar.module').then((m) => m.CalendarModule)
  },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
