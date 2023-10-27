import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitaEditComponent } from './unita-edit.component';

describe('UnitaEditComponent', () => {
  let component: UnitaEditComponent;
  let fixture: ComponentFixture<UnitaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
