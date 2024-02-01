import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutRoutingModule } from './workout-routing-module';
import { ExerciseComponent } from './exercise/exercise.component';
import { TrainingLogComponent } from './training-log/training-log.component';
import { CreateTrainingComponent } from './create-training/create-training.component';
import { AddExerciseComponent } from './add-exercise/add-exercise.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditWorkoutComponent } from './edit-workout/edit-workout.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../app.module';
import { CreateTrainerComponent } from './create-trainer/create-trainer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TrainerTrainingLogComponent } from './trainer-training-log/trainer-training-log.component';



@NgModule({
  declarations: [
    ExerciseComponent,
    TrainingLogComponent,
    CreateTrainingComponent,
    AddExerciseComponent,
    EditWorkoutComponent,
    CreateTrainerComponent,
    TrainerTrainingLogComponent
  ],
  imports: [
    CommonModule,
    WorkoutRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
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
export class WorkoutModule { }
