import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DietDiaryComponent } from './diet-diary/diet-diary.component';
import { DietRoutingModule } from './diet-routing-module';
import { FoodFormComponent } from './food-form/food-form.component';
import { FoodListComponent } from './food-list/food-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IncrementPipe } from '../pipe/increment.pipe';
import { DietFormComponent } from './diet-form/diet-form.component';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    DietDiaryComponent,
    FoodFormComponent,
    FoodListComponent,
    IncrementPipe,
    DietFormComponent
  ],
  imports: [
    CommonModule,
    DietRoutingModule,
    NgChartsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false }}
  ]
})
export class DietModule { }
