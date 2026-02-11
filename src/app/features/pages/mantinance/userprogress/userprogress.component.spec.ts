import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprogressComponent } from './userprogress.component';

describe('UserprogressComponent', () => {
  let component: UserprogressComponent;
  let fixture: ComponentFixture<UserprogressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserprogressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
