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



@NgModule({
  declarations: [
    ExerciseComponent,
    TrainingLogComponent,
    CreateTrainingComponent,
    AddExerciseComponent,
    EditWorkoutComponent
  ],
  imports: [
    CommonModule,
    WorkoutRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class WorkoutModule { }
