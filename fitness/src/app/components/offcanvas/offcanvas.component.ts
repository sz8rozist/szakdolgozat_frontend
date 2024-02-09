import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-offcanvas',
  templateUrl: './offcanvas.component.html',
  styleUrl: './offcanvas.component.css'
})
export class OffcanvasComponent {
  @ViewChild('content') offCanvasElement = ElementRef;
  constructor(private offCanvasService: NgbOffcanvas) {
 
  }

  openCanvas() {
    const canvasRef = this.offCanvasService.open(this.offCanvasElement, {
      keyboard: false,
      position: 'end'
    });

    canvasRef.result.then(
      (result) => {
        console.log(`Modal closed with: ${result}`);
      },
      (reason) => {
        console.log(`Modal dismissed with: ${reason}`);
      }
    );
  }

  closeCanvas() {
    this.offCanvasService.dismiss();
  }
}
