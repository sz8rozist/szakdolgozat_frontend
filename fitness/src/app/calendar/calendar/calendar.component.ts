import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';

import huLocale from '@fullcalendar/core/locales/hu';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, bootstrap5Plugin,interactionPlugin],
    initialView: 'dayGridMonth',
    eventClick: this.handleDateClick.bind(this),
    eventAdd: this.addEvent.bind(this),
    weekends: true,
    themeSystem: 'bootstrap5',
    locale: huLocale,
    events: [
      { title: 'Meeting', start: new Date() }
    ],
  };

  handleDateClick(input: any){
    console.log(input);
  }

  addEvent(input: any){
    console.log(input);

  }
}
