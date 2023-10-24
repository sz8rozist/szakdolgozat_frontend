import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import huLocale from '@fullcalendar/core/locales/hu';
@Component({
  selector: 'app-diet-diary',
  templateUrl: './diet-diary.component.html',
  styleUrls: ['./diet-diary.component.css']
})
export class DietDiaryComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: huLocale,
    events: [
      { title: 'Meeting', start: new Date() }
    ]
  };

  constructor(){}
}
