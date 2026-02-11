import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicWorkspaceComponent } from './academic-workspace.component';

describe('AcademicWorkspaceComponent', () => {
  let component: AcademicWorkspaceComponent;
  let fixture: ComponentFixture<AcademicWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicWorkspaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
