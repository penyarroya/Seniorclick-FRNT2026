import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPreguntasComponent } from './mis-preguntas.component';

describe('MisPreguntasComponent', () => {
  let component: MisPreguntasComponent;
  let fixture: ComponentFixture<MisPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisPreguntasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
