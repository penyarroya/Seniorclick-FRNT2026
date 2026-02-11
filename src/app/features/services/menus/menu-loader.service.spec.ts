import { TestBed } from '@angular/core/testing';

import { MenuLoaderService } from './menu-loader.service';

describe('MenuLoaderService', () => {
  let service: MenuLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
