import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSnackComponent } from './generic-snack.component';

describe('GenericSnackComponent', () => {
  let component: GenericSnackComponent;
  let fixture: ComponentFixture<GenericSnackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericSnackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
