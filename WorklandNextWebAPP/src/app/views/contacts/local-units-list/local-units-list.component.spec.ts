import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalUnitsListComponent } from './local-units-list.component';

describe('LocalUnitsListComponent', () => {
  let component: LocalUnitsListComponent;
  let fixture: ComponentFixture<LocalUnitsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocalUnitsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalUnitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
