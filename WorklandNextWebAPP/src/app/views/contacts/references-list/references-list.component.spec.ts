import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencesListComponent } from './references-list.component';

describe('ReferencesListComponent', () => {
  let component: ReferencesListComponent;
  let fixture: ComponentFixture<ReferencesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
