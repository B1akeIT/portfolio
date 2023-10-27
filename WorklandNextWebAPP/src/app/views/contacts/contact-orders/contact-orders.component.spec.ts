import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactQuotesComponent } from './contact-orders.component';

describe('ContactQuotesComponent', () => {
  let component: ContactQuotesComponent;
  let fixture: ComponentFixture<ContactQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
