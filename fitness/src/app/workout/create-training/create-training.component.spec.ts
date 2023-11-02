import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainingComponent } from './create-training.component';

describe('CreateTrainingComponent', () => {
  let component: CreateTrainingComponent;
  let fixture: ComponentFixture<CreateTrainingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTrainingComponent]
    });
    fixture = TestBed.createComponent(CreateTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
