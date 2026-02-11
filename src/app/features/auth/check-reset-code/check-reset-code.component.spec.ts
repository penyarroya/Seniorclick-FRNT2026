import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetCodeComponent } from './check-reset-code.component';

describe('CheckResetCodeComponent', () => {
  let component: ResetCodeComponent;
  let fixture: ComponentFixture<ResetCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
