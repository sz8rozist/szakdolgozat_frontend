import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerDiaryComponent } from './trainer-diary.component';

describe('TrainerDiaryComponent', () => {
  let component: TrainerDiaryComponent;
  let fixture: ComponentFixture<TrainerDiaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerDiaryComponent]
    });
    fixture = TestBed.createComponent(TrainerDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
