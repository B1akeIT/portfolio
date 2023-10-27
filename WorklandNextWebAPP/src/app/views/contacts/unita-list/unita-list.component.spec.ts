import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitaListComponent } from './unita-list.component';

describe('UnitaListComponent', () => {
  let component: UnitaListComponent;
  let fixture: ComponentFixture<UnitaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
