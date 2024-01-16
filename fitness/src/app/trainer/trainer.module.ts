import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerRoutingModule } from './trainer-routing';
import { TrainerGuestsComponent } from './trainer-guests/trainer-guests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../app.module';
import { DietRecommedationComponent } from './diet-recommedation/diet-recommedation.component';



@NgModule({
  declarations: [
    TrainerGuestsComponent,
    DietRecommedationComponent,
  ],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class TrainerModule { }
