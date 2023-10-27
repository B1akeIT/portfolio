import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFieldViewComponent } from './table-field-view.component';

describe('TableFieldViewComponent', () => {
  let component: TableFieldViewComponent;
  let fixture: ComponentFixture<TableFieldViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFieldViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFieldViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
