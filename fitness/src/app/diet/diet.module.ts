import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DietDiaryComponent } from './diet-diary/diet-diary.component';
import { DietRoutingModule } from './diet-routing-module';
import { FullCalendarModule } from '@fullcalendar/angular';



@NgModule({
  declarations: [
    DietDiaryComponent
  ],
  imports: [
    CommonModule,
    DietRoutingModule,
    FullCalendarModule
  ]
})
export class DietModule { }
