import { TestBed } from '@angular/core/testing';

import { GeojsonDataService } from './geojson-data.service';

describe('GeojsonDataService', () => {
  let service: GeojsonDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeojsonDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
