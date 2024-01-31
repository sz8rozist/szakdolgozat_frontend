import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerRoutingModule } from './trainer-routing';
import { TrainerGuestsComponent } from './trainer-guests/trainer-guests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../app.module';
import { DietRecommedationComponent } from './diet-recommedation/diet-recommedation.component';
import { NewDietRecommedationComponent } from './new-diet-recommedation/new-diet-recommedation.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditDietRecommendationComponent } from './edit-diet-recommendation/edit-diet-recommendation.component';



@NgModule({
  declarations: [
    TrainerGuestsComponent,
    DietRecommedationComponent,
    NewDietRecommedationComponent,
    EditDietRecommendationComponent,
  ],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
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
