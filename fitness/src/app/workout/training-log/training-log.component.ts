import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgToastService } from 'ng-angular-popup';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Exercise } from 'src/app/model/Exercise';
import { Trainer } from 'src/app/model/Trainer';
import { User } from 'src/app/model/User';
import { Workout } from 'src/app/model/Workout';
import { WorkoutUpdateRequest } from 'src/app/model/WorkoutUpdateRequest';
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
  workoutId?: number;
  workoutForm: FormGroup;
  exercisess: Exercise[] = [];
  @ViewChild('modalRef') modalRef!: ModalComponent;
  constructor(
    private authService: AuthService,
    private workoutService: WorkoutService,
    private toast: NgToastService,
    private exerciseService: ExerciseService,
    private guestService: GuestService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {this.workoutForm = new FormGroup({
    exerciseId: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    sets: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    repetitions: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });}

  ngOnInit(){
    const date = this.route.snapshot.paramMap.get('date');
    if(date){
      this.date = date;
      this.loadWorkout(date);
      this.giveByTrainer = this.workouts.every((workout) => !workout.trainer);
    }
    this.exerciseService
      .getAllExerciseWithoutPagination()
      .subscribe((response: Exercise[]) => {
        this.exercises = [...response];
      });
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

  openEditModal(id: Workout) {
    this.workoutId = id.workoutId;
    this.modalRef.openModal();
   this.loadWorkoutToEdit(id.workoutId as number);
  }

  
  loadWorkoutToEdit(workoutId: number) {
    if (workoutId) {
      this.workoutService
        .getWorkoutByID(Number(workoutId))
        .subscribe((response: Workout) => {
          if (response) {
            this.patchForm(response);
          }
        });
    }
  }

  patchForm(workout: Workout) {
    this.workoutForm.patchValue({
      exerciseId: workout.exercise.id,
      date: workout.date,
      sets: workout.sets,
      repetitions: workout.repetitions,
    });
  }

  saveGyakorlat() {
    if (this.workoutForm.valid) {
      const data: WorkoutUpdateRequest = {
        exerciseId: this.workoutForm.get('exerciseId')?.value,
        date: this.workoutForm.get('date')?.value,
        sets: this.workoutForm.get('sets')?.value,
        repetitions: this.workoutForm.get('repetitions')?.value,
      };
      this.workoutService
        .saveExerciseInWorkout(data, Number(this.workoutId))
        .subscribe(() => {
          this.toast.success({
            detail: 'Sikeres',
            summary: 'Sikeres frissítés!',
            duration: 2000,
            type: 'success',
          });
         this.modalRef.closeModal();
         this.loadWorkout(this.date);
        });
    }
  }
}
