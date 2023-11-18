import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerComponent } from './trainer/trainer.component';
import { TrainerRoutingModule } from './trainer-routing';
import { TrainerGuestsComponent } from './trainer-guests/trainer-guests.component';



@NgModule({
  declarations: [
    TrainerComponent,
    TrainerGuestsComponent
  ],
  imports: [
    CommonModule,
    TrainerRoutingModule,
  ]
})
export class TrainerModule { }
