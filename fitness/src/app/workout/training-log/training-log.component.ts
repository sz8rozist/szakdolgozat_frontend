import { Component } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { Exercise } from 'src/app/model/Exercise';
import { User } from 'src/app/model/User';
import { UserResponse } from 'src/app/model/UserResponse';
import { Workout } from 'src/app/model/Workout';
import { AuthService } from 'src/app/service/auth.service';
import { ExerciseService } from 'src/app/service/exercise.service';
import { WorkoutService } from 'src/app/service/workout.service';

@Component({
  selector: 'app-training-log',
  templateUrl: './training-log.component.html',
  styleUrls: ['./training-log.component.css']
})
export class TrainingLogComponent {
  date: string = "";
  workouts: Workout[] = [];
  exercises: Exercise[] = [];

  constructor(
    private authService: AuthService,
    private workoutService: WorkoutService,
    private toast: NgToastService,
    private exerciseService: ExerciseService
  ){}

  loadWorkout(date: string){
    const token = this.authService.getDecodedToken();
    this.workoutService.getWorkouts(token.sub as number, date).subscribe((resp: Workout[]) =>{
      if(resp.length == 0){
        this.toast.warning({
          detail: 'Figyelmeztetés',
          summary: 'Ehhez a dátumhoz nem tartozik edzésterv!',
          duration: 2000,
          type: 'warning',
        });
      }
      this.workouts = [...resp];
    });
  }

  change(){
    this.loadWorkout(this.date);
  }

  targetedBodyPart(part: string){
    switch(part){
      case "CHEST": return "Mell";
      case "SHOULDER": return "Váll";
      case "ABS": return "Has";
      case "BACK": return "Hát";
      case "ARMS": return "Kar";
      case "LEGS": return "Láb";
      default: return "";
    }
  }

  deleteExercise(workoutId: any){
    this.authService.getAuthData().subscribe((resp: UserResponse) =>{
      if(resp && resp.guest != null){
        this.exerciseService.deleteExercise(workoutId, resp.guest.id as number).subscribe(() =>{
          this.loadWorkout(this.date);
          this.toast.success({
            detail: 'Sikeres',
            summary: 'Sikeres törlés!',
            duration: 2000,
            type: 'success',
          });
        });
      }
    });
  }

  deleteWorkout(){
    this.authService.getAuthData().subscribe((resp: UserResponse) =>{
      if(resp && resp.guest != null){
        this.workoutService.deleteWorkout(resp.guest.id as number, this.date).subscribe(() =>{
          this.workouts = [];
          this.date = "";
          this.toast.success({
            detail: 'Sikeres',
            summary: 'Sikeres törlés!',
            duration: 2000,
            type: 'success',
          });
        });
      }
    });
  }
}
