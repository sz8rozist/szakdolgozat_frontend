import { Component } from '@angular/core';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgToastService } from 'ng-angular-popup';
import { Guest } from 'src/app/model/Guest';
import { User } from 'src/app/model/User';
import { Workout } from 'src/app/model/Workout';
import { AuthService } from 'src/app/service/auth.service';
import { ExerciseService } from 'src/app/service/exercise.service';
import { GuestService } from 'src/app/service/guest.service';
import { WorkoutService } from 'src/app/service/workout.service';

@Component({
  selector: 'app-trainer-training-log',
  templateUrl: './trainer-training-log.component.html',
  styleUrls: ['./trainer-training-log.component.css'],
})
export class TrainerTrainingLogComponent {
  date: string = '';
  selectedGuest?: number;
  workouts: Workout[] = [];
  guests: Guest[] = [];
  faTrash = faTrash;
  faEdit = faEdit;
  giveByTrainer: boolean = false;
  constructor(
    private authService: AuthService,
    private workoutService: WorkoutService,
    private toast: NgToastService,
    private exerciseService: ExerciseService,
    private guestService: GuestService
  ) {}

  loadWorkout(date: string, guestId: number) {
    this.workoutService
      .getWorkouts(guestId, date)
      .subscribe((resp: Workout[]) => {
        if (resp.length == 0) {
          this.toast.warning({
            detail: 'Figyelmeztetés',
            summary: 'Ehhez a dátumhoz nem tartozik edzésterv!',
            duration: 2000,
            type: 'warning',
          });
        }
        this.giveByTrainer = resp.every((workout) => workout.trainer != null);
        this.workouts = [...resp];
      });
  }

  change() {
    if (!this.selectedGuest) {
      this.toast.warning({
        detail: 'Figyelmeztetés',
        summary: 'Nincs kiválasztva vendég!',
        duration: 2000,
        type: 'warning',
      });
    } else {
      this.loadWorkout(this.date, this.selectedGuest);
      console.log(this.giveByTrainer);
    }
  }

  changeGuest() {
    if (this.date && this.selectedGuest) {
      this.loadWorkout(this.date, this.selectedGuest);
    }
  }

  ngOnInit() {
    this.authService.getAuthData().subscribe((response: User) => {
      this.guestService
        .getTrainerGuests(response.trainer.id as number)
        .subscribe((resp: Guest[]) => {
          this.guests = [...resp];
        });
    });
  }

  targetedBodyPart(part: string) {
    switch (part) {
      case 'CHEST':
        return 'Mell';
      case 'SHOULDER':
        return 'Váll';
      case 'ABS':
        return 'Has';
      case 'BACK':
        return 'Hát';
      case 'ARMS':
        return 'Kar';
      case 'LEGS':
        return 'Láb';
      default:
        return '';
    }
  }
  deleteWorkout() {
    this.authService.getAuthData().subscribe((resp: User) => {
      if (resp && resp.trainer != null) {
        this.workoutService
          .deleteWorkout(this.selectedGuest as number, this.date)
          .subscribe(() => {
            this.workouts = [];
            this.date = '';
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

  deleteExercise(workoutId: any) {
    this.authService.getAuthData().subscribe((resp: User) => {
      if (resp && resp.trainer != null) {
        this.exerciseService
          .deleteExercise(workoutId, this.selectedGuest as number)
          .subscribe(() => {
            if (this.selectedGuest) {
              this.loadWorkout(this.date, this.selectedGuest);
            }

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
