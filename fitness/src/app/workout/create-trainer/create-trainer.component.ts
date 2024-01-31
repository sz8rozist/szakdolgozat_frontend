import { Component } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgToastService } from 'ng-angular-popup';
import { Exercise } from 'src/app/model/Exercise';
import { Guest } from 'src/app/model/Guest';
import { Trainer } from 'src/app/model/Trainer';
import { User } from 'src/app/model/User';
import { WorkoutRequest } from 'src/app/model/WorkoutRequest';
import { AuthService } from 'src/app/service/auth.service';
import { ExerciseService } from 'src/app/service/exercise.service';
import { GuestService } from 'src/app/service/guest.service';
import { WorkoutService } from 'src/app/service/workout.service';

@Component({
  selector: 'app-create-trainer',
  templateUrl: './create-trainer.component.html',
  styleUrls: ['./create-trainer.component.css'],
})
export class CreateTrainerComponent {
  workouts: WorkoutRequest[] = [];
  exercises: Exercise[] = [];
  faTrash = faTrash;

  date: string = '';
  selectedGuest?: number;
  trainer?: Trainer;
  guests: Guest[] = [];
  constructor(
    private exerciseService: ExerciseService,
    private toast: NgToastService,
    private workoutService: WorkoutService,
    private authService: AuthService,
    private guestService: GuestService
  ) {}

  ngOnInit() {
    this.exerciseService
      .getAllExerciseWithoutPagination()
      .subscribe((response: Exercise[]) => {
        this.exercises = [...response];
      });
    this.authService.getAuthData().subscribe((response: User) => {
      this.trainer = response.trainer;
      this.guestService
        .getTrainerGuests(response.trainer.id as number)
        .subscribe((resp: Guest[]) => {
          this.guests = [...resp];
        });
    });
  }

  addWorkout() {
    const newWorkout: WorkoutRequest = {
      exerciseId: '',
      repetitions: '',
      sets: '',
    };
    this.workouts.push(newWorkout);
  }

  removeWorkout(index: number) {
    this.workouts.splice(index, 1);
  }

  saveWorkout() {
    if (this.date == '') {
      this.toast.error({
        detail: 'Sikertelen',
        summary: 'Dátum megadása kötelező!',
        duration: 2000,
        type: 'error',
      });
    } else if (this.workouts.length == 0) {
      this.toast.error({
        detail: 'Sikertelen',
        summary: 'Nincsenek kiválasztva gyakorlatok!',
        duration: 2000,
        type: 'error',
      });
    } else if (!this.selectedGuest) {
      this.toast.error({
        detail: 'Hiba',
        summary: 'Vendég kiválasztása kötelező!',
        duration: 2000,
        type: 'error',
      });
      return;
    } else {
      const token = this.authService.getDecodedToken();
      this.workoutService
        .trainerSaveWorkout(token.sub as number, this.date, this.selectedGuest, this.workouts)
        .subscribe(() => {
          this.date = '';
          this.selectedGuest = 0;
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
