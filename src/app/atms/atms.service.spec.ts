import { TestBed } from '@angular/core/testing';

import { AtmsService } from './atms.service';

describe('AtmsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AtmsService = TestBed.get(AtmsService);
    expect(service).toBeTruthy();
  });
});
