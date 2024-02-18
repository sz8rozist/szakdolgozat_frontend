import {
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';
import huLocale from '@fullcalendar/core/locales/hu';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { AuthService } from 'src/app/service/auth.service';
import { DietService } from 'src/app/service/diet.service';
import { User } from 'src/app/model/User';
import { CalendarEvent } from 'src/app/model/CalendarEvent';
import { WorkoutService } from 'src/app/service/workout.service';
import { Router } from '@angular/router';
import { DietResponse } from 'src/app/model/DietResponse';
import { Workout } from 'src/app/model/Workout';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class CalendarComponent {
  dietModalTitle: string = '';
  workoutModalTitle: string = '';
  newEventTitleDate: string = '';
  selectedGuestId?: number;
  diet?: DietResponse;
  workout?: Workout[] = [];
  events: CalendarEvent[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, bootstrap5Plugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    themeSystem: 'bootstrap5',
    eventClick: this.handleEventClick.bind(this),
    locale: huLocale,
    events: [],
  }; // A calendarOptions változó
  @ViewChild('dietModalRef') dietModalRef!: ModalComponent;
  @ViewChild('workoutModalRef') workoutModalRef!: ModalComponent;
  constructor(
    private authService: AuthService,
    private dietService: DietService,
    private workoutService: WorkoutService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const response: User | undefined = await this.authService
        .getAuthData()
        .toPromise();

      if (response?.trainer) {
        // Kezelheted a trainer logikát, ha szükséges
        const resp: CalendarEvent[] | undefined = await this.dietService
          .getAllTrainerGuestDiet(response.trainer.id as number)
          .toPromise();
        const workout: CalendarEvent[] | undefined = await this.workoutService
          .getAllTrainerGuestWorkout(response.trainer.id as number)
          .toPromise();
        if (resp) {
          this.events = [...resp];
        }
        if (workout) {
          this.events = [...this.events, ...workout];
        }
        this.initializeCalendarOptions();
      } else if (response?.guest) {
        const resp: CalendarEvent[] | undefined = await this.dietService
          .getAllDietByGuest(response.guest.id as number)
          .toPromise();
        const workoutEvent: CalendarEvent[] | undefined =
          await this.workoutService
            .getAllWorkoutByGuest(response.guest.id as number)
            .toPromise();
        if (resp) {
          this.events = [...resp];
        }
        if (workoutEvent) {
          this.events = [...this.events, ...workoutEvent];
        }
        this.initializeCalendarOptions(); // calendarOptions inicializálása a második API kérés sikere esetén
      }
    } catch (error) {
      console.error('Hiba történt:', error);
    }
  }

  initializeCalendarOptions() {
    this.calendarOptions = {
      events: this.events,
    };
  }

  handleEventClick(args: any) {
    var currentDate = new Date(args.event.start);
    // Év, hónap és nap külön változókba mentése
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Hónap 0-tól kezdődik, ezért +1, és két számjegyű formátumra alakítás
    var day = currentDate.getDate().toString().padStart(2, '0'); // Nap két számjegyű formátumra alakítás
    // Dátum összeállítása a kívánt formátumban
    var formattedDate = year + '-' + month + '-' + day;
    if (args.event._def.extendedProps.isTrainer) {
      //Trainer event
      if (args.event._def.extendedProps.isDiet) {
        this.dietModalTitle = 'Étrend - ' + formattedDate;
        this.selectedGuestId = args.event._def.extendedProps.guestId;
        this.dietModalRef.setIsCalendar(true);
        this.dietService
          .getDietByDateAndGuestId(
            this.selectedGuestId as number,
            formattedDate
          )
          .subscribe((resp: DietResponse) => {
            this.diet = resp;
          });
        this.dietModalRef.openModal();
      } else {
        this.workoutModalTitle = 'Edzés - ' + formattedDate;
        this.selectedGuestId = args.event._def.extendedProps.guestId;
        this.workoutModalRef.setIsCalendar(true);
        this.workoutService
          .getWorkouts(this.selectedGuestId as number, formattedDate)
          .subscribe((resp: Workout[]) => {
            this.workout = [...resp];
          });
        this.workoutModalRef.openModal();
      }
    } else {
      //Guest event
      if (args.event._def.extendedProps.isDiet) {
        this.router.navigateByUrl('/diet/diary/' + formattedDate);
      } else {
        this.router.navigateByUrl('/workout/training-log/' + formattedDate);
      }
    }
  }

  translateType(type: string) {
    switch (type) {
      case 'LUNCH':
        return 'Ebéd';
      case 'BREAKFAST':
        return 'Reggeli';
      case 'DINNER':
        return 'Vacsora';
      case 'SNACK':
        return 'Snack';
      default:
        return '';
    }
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
}
