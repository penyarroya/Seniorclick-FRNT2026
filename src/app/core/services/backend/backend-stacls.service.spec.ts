import { TestBed } from '@angular/core/testing';
import { BackendStaclsService } from './backend-stacls.service';


describe('BackendStaclsService', () => {
  let service: BackendStaclsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendStaclsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
