import { TestBed, inject } from '@angular/core/testing';

import { PointincountyService } from './pointincounty.service';

describe('PointincountyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PointincountyService]
    });
  });

  it('should be created', inject([PointincountyService], (service: PointincountyService) => {
    expect(service).toBeTruthy();
  }));
});
