import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceQuotesComponent } from './invoice-orders.component';

describe('InvoiceQuotesComponent', () => {
  let component: InvoiceQuotesComponent;
  let fixture: ComponentFixture<InvoiceQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
