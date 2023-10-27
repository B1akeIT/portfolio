import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierEditComponent } from './carrier-edit.component';

describe('CarrierEditComponent', () => {
  let component: CarrierEditComponent;
  let fixture: ComponentFixture<CarrierEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
