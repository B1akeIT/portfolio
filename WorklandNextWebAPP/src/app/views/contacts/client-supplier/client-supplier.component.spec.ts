import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSupplierComponent } from './client-supplier.component';

describe('ClientSupplierComponent', () => {
  let component: ClientSupplierComponent;
  let fixture: ComponentFixture<ClientSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
