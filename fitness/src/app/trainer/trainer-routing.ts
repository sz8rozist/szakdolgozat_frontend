import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { TrainerGuestsComponent } from './trainer-guests/trainer-guests.component';
import { DietRecommedationComponent } from './diet-recommedation/diet-recommedation.component';
import { NewDietRecommedationComponent } from './new-diet-recommedation/new-diet-recommedation.component';
import { EditDietRecommendationComponent } from './edit-diet-recommendation/edit-diet-recommendation.component';

const routes: Routes = [
  {path: '', component: TrainerGuestsComponent, canActivate: [AuthGuard]},
  {path: 'dietRecommedation/:guestId', component: DietRecommedationComponent, canActivate: [AuthGuard]},
  {path: 'newDietRecommedation/:guestId', component: NewDietRecommedationComponent, canActivate: [AuthGuard]},
  {path: 'editDietRecommendation/:id/:guestId', component: EditDietRecommendationComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainerRoutingModule { }
