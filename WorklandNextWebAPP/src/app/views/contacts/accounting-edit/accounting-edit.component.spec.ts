import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingEditComponent } from './accounting-edit.component';

describe('AccountingEditComponent', () => {
  let component: AccountingEditComponent;
  let fixture: ComponentFixture<AccountingEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
