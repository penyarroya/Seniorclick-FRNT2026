import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFullPageComponent } from './resource-full-page.component';

describe('ResourceFullPageComponent', () => {
  let component: ResourceFullPageComponent;
  let fixture: ComponentFixture<ResourceFullPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceFullPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceFullPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
