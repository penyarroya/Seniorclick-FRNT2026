import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceLayoutWrapperComponent } from './maintenance-layout-wrapper.component';

describe('MaintenanceLayoutWrapperComponent', () => {
  let component: MaintenanceLayoutWrapperComponent;
  let fixture: ComponentFixture<MaintenanceLayoutWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceLayoutWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceLayoutWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
