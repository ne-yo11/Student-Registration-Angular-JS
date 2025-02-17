import { TestBed } from '@angular/core/testing';

import { MasterlistService } from './masterlist.service';

describe('MasterlistService', () => {
  let service: MasterlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
