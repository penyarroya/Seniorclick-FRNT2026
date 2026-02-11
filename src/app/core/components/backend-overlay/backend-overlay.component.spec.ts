import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendOverlayComponent } from './backend-overlay.component';

describe('BackendOverlayComponent', () => {
  let component: BackendOverlayComponent;
  let fixture: ComponentFixture<BackendOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackendOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackendOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
