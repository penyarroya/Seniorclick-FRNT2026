import { TestBed } from '@angular/core/testing';

import { MenuInitService } from './menu-init.service';

describe('MenuInitService', () => {
  let service: MenuInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
