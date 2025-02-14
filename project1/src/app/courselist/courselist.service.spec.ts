import { TestBed } from '@angular/core/testing';

import { CourselistService } from './courselist.service';

describe('CourselistService', () => {
  let service: CourselistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourselistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
