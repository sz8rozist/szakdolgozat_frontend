import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncrementPipe } from '../pipe/increment.pipe';
import { ModalComponent } from '../components/modal/modal.component';



@NgModule({
  declarations: [
    IncrementPipe,
    ModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IncrementPipe,
    ModalComponent
  ]
})
export class SharedModule { }
