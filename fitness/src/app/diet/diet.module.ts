import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DietDiaryComponent } from './diet-diary/diet-diary.component';
import { DietRoutingModule } from './diet-routing-module';
import { FoodFormComponent } from './food-form/food-form.component';
import { FoodListComponent } from './food-list/food-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IncrementPipe } from '../pipe/increment.pipe';



@NgModule({
  declarations: [
    DietDiaryComponent,
    FoodFormComponent,
    FoodListComponent,
    IncrementPipe
  ],
  imports: [
    CommonModule,
    DietRoutingModule,
    ReactiveFormsModule
  ]
})
export class DietModule { }
