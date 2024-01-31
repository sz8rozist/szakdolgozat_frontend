import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDietRecommedationComponent } from './new-diet-recommedation.component';

describe('NewDietRecommedationComponent', () => {
  let component: NewDietRecommedationComponent;
  let fixture: ComponentFixture<NewDietRecommedationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDietRecommedationComponent]
    });
    fixture = TestBed.createComponent(NewDietRecommedationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
