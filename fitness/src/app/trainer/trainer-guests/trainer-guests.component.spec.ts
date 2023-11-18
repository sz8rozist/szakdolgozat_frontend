import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerGuestsComponent } from './trainer-guests.component';

describe('TrainerGuestsComponent', () => {
  let component: TrainerGuestsComponent;
  let fixture: ComponentFixture<TrainerGuestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerGuestsComponent]
    });
    fixture = TestBed.createComponent(TrainerGuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
