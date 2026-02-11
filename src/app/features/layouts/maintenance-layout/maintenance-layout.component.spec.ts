// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { MaintenanceLayoutComponent } from './maintenance-layout.component';

// describe('MaintenanceLayoutComponent', () => {
//   let component: MaintenanceLayoutComponent;
//   let fixture: ComponentFixture<MaintenanceLayoutComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [MaintenanceLayoutComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(MaintenanceLayoutComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceLayoutComponent, ColumnConfig, CrudService, Page } from './maintenance-layout.component';
import { of } from 'rxjs';

// Mock service
class MockService implements CrudService<any> {
  list(params: any) {
    return of({ items: [], total: 0 } as Page<any>);
  }
  delete(id: number | string) {
    return of(void 0);
  }
}

// Mock columns
const mockColumns: ColumnConfig[] = [
  { key: 'id', label: 'ID', priority: 1 },
  { key: 'name', label: 'Nombre', priority: 1 }
];

describe('MaintenanceLayoutComponent', () => {
  let component: MaintenanceLayoutComponent<any>;
  let fixture: ComponentFixture<MaintenanceLayoutComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceLayoutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceLayoutComponent);
    component = fixture.componentInstance;

    // Asignar inputs obligatorios
    component.columns = mockColumns;
    component.service = new MockService();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', () => {
    spyOn(component.service, 'list').and.callThrough();
    component.ngOnInit();
    expect(component.service.list).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(0);
  });
});

