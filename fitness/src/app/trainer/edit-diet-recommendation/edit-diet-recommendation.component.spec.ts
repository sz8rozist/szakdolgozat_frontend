import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDietRecommendationComponent } from './edit-diet-recommendation.component';

describe('EditDietRecommendationComponent', () => {
  let component: EditDietRecommendationComponent;
  let fixture: ComponentFixture<EditDietRecommendationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDietRecommendationComponent]
    });
    fixture = TestBed.createComponent(EditDietRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
