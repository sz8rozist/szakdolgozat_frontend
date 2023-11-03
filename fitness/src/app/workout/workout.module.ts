import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutRoutingModule } from './workout-routing-module';
import { ExerciseComponent } from './exercise/exercise.component';
import { TrainingLogComponent } from './training-log/training-log.component';
import { CreateTrainingComponent } from './create-training/create-training.component';
import { IncrementPipe } from '../pipe/increment.pipe';
import { AddExerciseComponent } from './add-exercise/add-exercise.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditWorkoutComponent } from './edit-workout/edit-workout.component';



@NgModule({
  declarations: [
    ExerciseComponent,
    TrainingLogComponent,
    CreateTrainingComponent,
    IncrementPipe,
    AddExerciseComponent,
    EditWorkoutComponent
  ],
  imports: [
    CommonModule,
    WorkoutRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class WorkoutModule { }
