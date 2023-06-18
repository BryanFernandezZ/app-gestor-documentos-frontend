import { TestBed } from '@angular/core/testing';

import { AreaGuard } from './area.guard';

describe('AreaGuard', () => {
  let guard: AreaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AreaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
