import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableModelViewComponent } from './table-model-view.component';

describe('TableModelViewComponent', () => {
  let component: TableModelViewComponent;
  let fixture: ComponentFixture<TableModelViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableModelViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
