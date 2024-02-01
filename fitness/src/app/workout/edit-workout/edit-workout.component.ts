import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Exercise } from 'src/app/model/Exercise';
import { Workout } from 'src/app/model/Workout';
import { WorkoutUpdateRequest } from 'src/app/model/WorkoutUpdateRequest';
import { ExerciseService } from 'src/app/service/exercise.service';
import { WorkoutService } from 'src/app/service/workout.service';

@Component({
  selector: 'app-edit-workout',
  templateUrl: './edit-workout.component.html',
  styleUrls: ['./edit-workout.component.css']
})
export class EditWorkoutComponent {
  workoutForm: FormGroup;
  exercises: Exercise[] = [];

  constructor(
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: NgToastService
  ){
    this.workoutForm = new FormGroup({
      exerciseId: new FormControl('',[Validators.required]),
      date: new FormControl('', [Validators.required]),
      sets: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
      repetitions: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')])
    });
  }

  ngOnInit(){
    this.exerciseService.getAllExerciseWithoutPagination().subscribe((response: Exercise[]) =>{
      this.exercises = [...response];
    });
    this.loadWorkout();
  }

  loadWorkout(){
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.workoutService.getWorkoutByID(Number(id)).subscribe((response: Workout) =>{
        if(response){
          this.patchForm(response);
        }
      });
    }
  }

  patchForm(workout: Workout){
    this.workoutForm.patchValue({
      exerciseId: workout.exercise.id,
      date: workout.date,
      sets: workout.sets,
      repetitions: workout.repetitions
    });
  }

  onSubmit(){
    if(this.workoutForm.valid){
      const id = this.route.snapshot.paramMap.get('id');
      const data: WorkoutUpdateRequest = {
        exerciseId: this.workoutForm.get('exerciseId')?.value,
        date: this.workoutForm.get('date')?.value,
        sets: this.workoutForm.get('sets')?.value,
        repetitions: this.workoutForm.get('repetitions')?.value
      };
      this.workoutService.saveExerciseInWorkout(data, Number(id)).subscribe(() =>{
        this.toast.success({
          detail: 'Sikeres',
          summary: 'Sikeres frissítés!',
          duration: 2000,
          type: 'success',
        });
        this.workoutForm.reset();
      });
    }
  }
}
