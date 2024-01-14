import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietRecommedationComponent } from './diet-recommedation.component';

describe('DietRecommedationComponent', () => {
  let component: DietRecommedationComponent;
  let fixture: ComponentFixture<DietRecommedationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DietRecommedationComponent]
    });
    fixture = TestBed.createComponent(DietRecommedationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
