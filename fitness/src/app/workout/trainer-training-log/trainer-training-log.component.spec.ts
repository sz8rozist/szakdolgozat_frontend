import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerTrainingLogComponent } from './trainer-training-log.component';

describe('TrainerTrainingLogComponent', () => {
  let component: TrainerTrainingLogComponent;
  let fixture: ComponentFixture<TrainerTrainingLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerTrainingLogComponent]
    });
    fixture = TestBed.createComponent(TrainerTrainingLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
