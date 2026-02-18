import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisyProfilesComponent } from './misy-profiles.component';

describe('MisyProfilesComponent', () => {
  let component: MisyProfilesComponent;
  let fixture: ComponentFixture<MisyProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisyProfilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisyProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
