import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { ExerciseComponent } from './exercise/exercise.component';
import { TrainingLogComponent } from './training-log/training-log.component';
import { CreateTrainingComponent } from './create-training/create-training.component';
import { AddExerciseComponent } from './add-exercise/add-exercise.component';
import { CreateTrainerComponent } from './create-trainer/create-trainer.component';
import { TrainerTrainingLogComponent } from './trainer-training-log/trainer-training-log.component';


const routes: Routes = [
  {path: 'exercises', component: ExerciseComponent, canActivate: [AuthGuard]},
  {path: 'training-log/:date', component: TrainingLogComponent, canActivate: [AuthGuard]},
  {path: 'create', component: CreateTrainingComponent, canActivate: [AuthGuard]},
  {path: 'addExercise', component: AddExerciseComponent, canActivate: [AuthGuard]},
  {path: 'create-trainer', component: CreateTrainerComponent, canActivate: [AuthGuard]},
  {path: 'trainer-training-log', component: TrainerTrainingLogComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkoutRoutingModule { }
