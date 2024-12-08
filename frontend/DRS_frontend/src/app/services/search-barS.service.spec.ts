import { TestBed } from '@angular/core/testing';

import { SearchBarService } from './search-barS.service';

describe('SearchBarService', () => {
  let service: SearchBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
