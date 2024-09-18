import { TestBed } from '@angular/core/testing';

import { AtheneaformService } from './atheneaform.service';

describe('AtheneaformService', () => {
  let service: AtheneaformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtheneaformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
