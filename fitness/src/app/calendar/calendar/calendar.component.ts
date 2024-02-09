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
  @ViewChild('modalRef') modalRef!: ModalComponent;
  @ViewChild('newEventModal') newEventModal!: ModalComponent;

  event = [
    { title: 'Present', date: '2024-02-09', color: '#0000fff' },
    { title: 'Present', date: '2024-02-10', color: '#0000fff' },
    { title: 'Present', date: '2024-02-12', color: '#0000fff' },
    { title: 'Present', date: '2024-02-20', color: '#0000fff' },
  ];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, bootstrap5Plugin, interactionPlugin],
    initialView: 'dayGridMonth',
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
    weekends: true,
    themeSystem: 'bootstrap5',
    locale: huLocale,
    events: this.event,
  };

  handleEventClick(input: any) {
    this.modalRef.openModal();
    this.title = input.event._def.title;
    this.start = input.event.start;
  }

  handleDateClick(input: any) {
    this.newEventModal.openModal();
    this.newEventTitleDate = input.date;
  }
}
