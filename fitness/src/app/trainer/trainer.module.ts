import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerComponent } from './trainer/trainer.component';
import { TrainerRoutingModule } from './trainer-routing';



@NgModule({
  declarations: [
    TrainerComponent
  ],
  imports: [
    CommonModule,
    TrainerRoutingModule,
  ]
})
export class TrainerModule { }
