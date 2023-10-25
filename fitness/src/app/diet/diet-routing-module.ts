import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { DietDiaryComponent } from './diet-diary/diet-diary.component';
import { FoodListComponent } from './food-list/food-list.component';
import { FoodFormComponent } from './food-form/food-form.component';


const routes: Routes = [
  {path: 'diary', component: DietDiaryComponent, canActivate: [AuthGuard]},
  {path: 'food', component: FoodListComponent, canActivate: [AuthGuard]},
  {path: 'addFood', component: FoodFormComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DietRoutingModule { }
