import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisResourcesComponent } from './mis-resources.component';

describe('MisResourcesComponent', () => {
  let component: MisResourcesComponent;
  let fixture: ComponentFixture<MisResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisResourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
