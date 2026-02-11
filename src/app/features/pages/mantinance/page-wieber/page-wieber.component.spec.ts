import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWieberComponent } from './page-wieber.component';

describe('PageWieberComponent', () => {
  let component: PageWieberComponent;
  let fixture: ComponentFixture<PageWieberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageWieberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageWieberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
