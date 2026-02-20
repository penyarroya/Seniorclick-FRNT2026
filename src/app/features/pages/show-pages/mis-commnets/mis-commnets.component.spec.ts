import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCommnetsComponent } from './mis-commnets.component';

describe('MisCommnetsComponent', () => {
  let component: MisCommnetsComponent;
  let fixture: ComponentFixture<MisCommnetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisCommnetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisCommnetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
