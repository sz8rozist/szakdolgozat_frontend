import { TestBed } from '@angular/core/testing';

import { DietRecommendationService } from './diet-recommendation.service';

describe('DietRecommendationService', () => {
  let service: DietRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DietRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
