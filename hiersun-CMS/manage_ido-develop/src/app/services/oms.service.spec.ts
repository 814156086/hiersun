import { TestBed } from '@angular/core/testing';

import { OmsService } from './oms.service';

describe('OmsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OmsService = TestBed.get(OmsService);
    expect(service).toBeTruthy();
  });
});
