import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainerComponent } from './create-trainer.component';

describe('CreateTrainerComponent', () => {
  let component: CreateTrainerComponent;
  let fixture: ComponentFixture<CreateTrainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTrainerComponent]
    });
    fixture = TestBed.createComponent(CreateTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
