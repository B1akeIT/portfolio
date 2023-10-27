import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierPreviewComponent } from './carrier-preview.component';

describe('CarrierPreviewComponent', () => {
  let component: CarrierPreviewComponent;
  let fixture: ComponentFixture<CarrierPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
