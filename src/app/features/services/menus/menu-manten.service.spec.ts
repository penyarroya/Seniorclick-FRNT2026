import { TestBed } from '@angular/core/testing';

import { MenuMantenService } from './menu-manten.service';

describe('MenuMantenService', () => {
  let service: MenuMantenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuMantenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
