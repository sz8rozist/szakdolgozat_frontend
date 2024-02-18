import {
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @ViewChild('content') modalElement = ElementRef;
  isCalendar: boolean = false;
  constructor(private modalService: NgbModal) {
 
  }

  openModal() {
    const modalRef = this.modalService.open(this.modalElement, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });

    modalRef.result.then(
      (result) => {
        console.log(`Modal closed with: ${result}`);
      },
      (reason) => {
        console.log(`Modal dismissed with: ${reason}`);
      }
    );
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  setIsCalendar(value: boolean){
    this.isCalendar = value;
  }
}
