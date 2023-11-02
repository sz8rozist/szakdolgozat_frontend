import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { ExerciseComponent } from './exercise/exercise.component';
import { TrainingLogComponent } from './training-log/training-log.component';
import { CreateTrainingComponent } from './create-training/create-training.component';
import { AddExerciseComponent } from './add-exercise/add-exercise.component';


const routes: Routes = [
  {path: 'exercises', component: ExerciseComponent, canActivate: [AuthGuard]},
  {path: 'training-log', component: TrainingLogComponent, canActivate: [AuthGuard]},
  {path: 'create', component: CreateTrainingComponent, canActivateChild: [AuthGuard]},
  {path: 'addExercise', component: AddExerciseComponent, canActivateChild: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkoutRoutingModule { }
