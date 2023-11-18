import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerComponent } from './trainer/trainer.component';
import { TrainerRoutingModule } from './trainer-routing';
import { TrainerGuestsComponent } from './trainer-guests/trainer-guests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TrainerComponent,
    TrainerGuestsComponent
  ],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TrainerModule { }
