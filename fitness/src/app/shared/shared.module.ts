import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncrementPipe } from '../pipe/increment.pipe';



@NgModule({
  declarations: [
    IncrementPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IncrementPipe
  ]
})
export class SharedModule { }
