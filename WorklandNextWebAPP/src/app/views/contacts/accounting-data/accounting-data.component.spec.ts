import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingDataComponent } from './accounting-data.component';

describe('AccountingDataComponent', () => {
  let component: AccountingDataComponent;
  let fixture: ComponentFixture<AccountingDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
