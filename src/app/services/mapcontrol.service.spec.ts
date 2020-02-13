import { TestBed } from '@angular/core/testing';

import { MapcontrolService } from './mapcontrol.service';

describe('MapcontrolService', () => {
  let service: MapcontrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapcontrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
