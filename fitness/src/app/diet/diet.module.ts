import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DietDiaryComponent } from './diet-diary/diet-diary.component';
import { DietRoutingModule } from './diet-routing-module';
import { FoodFormComponent } from './food-form/food-form.component';
import { FoodListComponent } from './food-list/food-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DietFormComponent } from './diet-form/diet-form.component';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';
import { NgToastModule } from 'ng-angular-popup';
import { SharedModule } from '../shared/shared.module';
import { CreateTrainerComponent } from './create-trainer/create-trainer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { TrainerDiaryComponent } from './trainer-diary/trainer-diary.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@NgModule({
  declarations: [
    DietDiaryComponent,
    FoodFormComponent,
    FoodListComponent,
    DietFormComponent,
    CreateTrainerComponent,
    TrainerDiaryComponent,
  ],
  imports: [
    CommonModule,
    DietRoutingModule,
    NgChartsModule,
    ReactiveFormsModule,
    NgToastModule,
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
  ],
})
export class DietModule {}
