import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { TrainerComponent } from './trainer/trainer.component';
import { TrainerGuestsComponent } from './trainer-guests/trainer-guests.component';
import { DietRecommedationComponent } from './diet-recommedation/diet-recommedation.component';

const routes: Routes = [
  {path: '', component: TrainerComponent, canActivate: [AuthGuard]},
  {path: 'trainer-guests', component: TrainerGuestsComponent, canActivate: [AuthGuard]},
  {path: 'dietRecommedation/:guestId', component: DietRecommedationComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainerRoutingModule { }
