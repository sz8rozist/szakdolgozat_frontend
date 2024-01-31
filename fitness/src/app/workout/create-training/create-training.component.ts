import { Component } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgToastService } from 'ng-angular-popup';
import { Exercise } from 'src/app/model/Exercise';
import { WorkoutRequest } from 'src/app/model/WorkoutRequest';
import { AuthService } from 'src/app/service/auth.service';
import { ExerciseService } from 'src/app/service/exercise.service';
import { WorkoutService } from 'src/app/service/workout.service';

@Component({
  selector: 'app-create-training',
  templateUrl: './create-training.component.html',
  styleUrls: ['./create-training.component.css']
})
export class CreateTrainingComponent {
  workouts: WorkoutRequest[] = [];
  exercises: Exercise[] = [];
  faTrash = faTrash;
  date: string = "";

  constructor(
    private exerciseService: ExerciseService,
    private toast: NgToastService,
    private workoutService: WorkoutService,
    private authService: AuthService
  ){}

  ngOnInit(){
    this.exerciseService.getAllExerciseWithoutPagination().subscribe((response: Exercise[]) =>{
      this.exercises = [...response];
    });
  }

  addWorkout() {
    const newWorkout: WorkoutRequest = {
      exerciseId: "",
      repetitions: "",
      sets: ""
    };
    this.workouts.push(newWorkout);
  }

  removeWorkout(index: number) {
    this.workouts.splice(index, 1);
  }

  saveWorkout(){
    if(this.date == ""){
      this.toast.error({
        detail: 'Sikertelen',
        summary: 'Dátum megadása kötelező!',
        duration: 2000,
        type: 'error',
      });
    }else if(this.workouts.length == 0){
      this.toast.error({
        detail: 'Sikertelen',
        summary: 'Nincsenek kiválasztva gyakorlatok!',
        duration: 2000,
        type: 'error',
      });
    }else{
      console.log(this.workouts);
      const token = this.authService.getDecodedToken();
      this.workoutService.saveWorkout(token.sub as number, this.date, this.workouts).subscribe(() =>{
        this.date = "";
        this.workouts = [];
        this.toast.success({
          detail: 'Sikeres',
          summary: 'Sikeres mentés!',
          duration: 2000,
          type: 'success',
        });
      });
    }
  }
}
