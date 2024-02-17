import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgToastService } from 'ng-angular-popup';
import { Exercise } from 'src/app/model/Exercise';
import { Trainer } from 'src/app/model/Trainer';
import { User } from 'src/app/model/User';
import { Workout } from 'src/app/model/Workout';
import { SocketWorkoutDto } from 'src/app/model/dto/SocketWorkoutDto';
import { AuthService } from 'src/app/service/auth.service';
import { ExerciseService } from 'src/app/service/exercise.service';
import { GuestService } from 'src/app/service/guest.service';
import { NotificationService } from 'src/app/service/notification.service';
import { WorkoutService } from 'src/app/service/workout.service';

@Component({
  selector: 'app-training-log',
  templateUrl: './training-log.component.html',
  styleUrls: ['./training-log.component.css'],
})
export class TrainingLogComponent {
  date: string = '';
  workouts: Workout[] = [];
  exercises: Exercise[] = [];
  giveByTrainer: boolean = false;
  faTrash = faTrash;
  faEdit = faEdit;
  constructor(
    private authService: AuthService,
    private workoutService: WorkoutService,
    private toast: NgToastService,
    private exerciseService: ExerciseService,
    private guestService: GuestService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(){
    const date = this.route.snapshot.paramMap.get('date');
    if(date){
      this.loadWorkout(date);
      this.giveByTrainer = this.workouts.every((workout) => !workout.trainer);
    }
  }

  loadWorkout(date: string) {
    this.authService.getAuthData().subscribe((response: User)  =>{
      if(response && response.guest != null){
        this.workoutService
        .getWorkouts(response.guest.id as number, date)
        .subscribe((resp: Workout[]) => {
          if (resp.length == 0) {
            this.toast.warning({
              detail: 'Figyelmeztetés',
              summary: 'Ehhez a dátumhoz nem tartozik edzésterv!',
              duration: 2000,
              type: 'warning',
            });
          }
          console.log(resp);
          this.workouts = [...resp];
        });
      }
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

  deleteExercise(workoutId: any) {
    this.authService.getAuthData().subscribe((resp: User) => {
      if (resp && resp.guest != null) {
        this.exerciseService
          .deleteExercise(workoutId, resp.guest.id as number)
          .subscribe(() => {
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

  deleteWorkout() {
    this.authService.getAuthData().subscribe((resp: User) => {
      if (resp && resp.guest != null) {
        this.workoutService
          .deleteWorkout(resp.guest.id as number, this.date)
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

  sendNotificationToTrainer(workout: Workout){
    const token = this.authService.getDecodedToken();
    const trainer = this.guestService.findTrainer(token.sub).toPromise();
    trainer.then(
      (response: Trainer | any) => {
        //console.log(response);
        const data: SocketWorkoutDto = {
          guestId: token.sub as number,
          trainerId: response.id,
          exerciseId: workout.exercise.id as number,
          workoutId: workout.workoutId as number,
        };
        this.notificationService.sendWorkoutNotificationToTrainer(data);
        this.loadWorkout(this.date);
      },
      (error) => {
        console.log(error.mesage);
      }
    );
  }
}
