import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietDiaryComponent } from './diet-diary.component';

describe('DietDiaryComponent', () => {
  let component: DietDiaryComponent;
  let fixture: ComponentFixture<DietDiaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DietDiaryComponent]
    });
    fixture = TestBed.createComponent(DietDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
