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
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class CalendarComponent {
  title: string = '';
  start: string = '';
  newEventTitleDate: string = '';
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
    console.log(args.event);

    var currentDate = new Date(args.event.start);

    // Év, hónap és nap külön változókba mentése
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Hónap 0-tól kezdődik, ezért +1, és két számjegyű formátumra alakítás
    var day = currentDate.getDate().toString().padStart(2, '0'); // Nap két számjegyű formátumra alakítás

    // Dátum összeállítása a kívánt formátumban
    var formattedDate = year + '-' + month + '-' + day;
    // A 'target' az útvonal neve, amit definiáltál
    if (args.event._def.title == 'Étrend') {
      this.router.navigateByUrl('/diet/diary/' + formattedDate);
    } else {
      this.router.navigateByUrl('/workout/training-log/' + formattedDate);
    }
  }
}
