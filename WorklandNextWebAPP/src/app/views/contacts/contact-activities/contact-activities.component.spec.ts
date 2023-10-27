import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactActivitiesComponent } from './contact-activities.component';

describe('ContactActivitiesComponent', () => {
  let component: ContactActivitiesComponent;
  let fixture: ComponentFixture<ContactActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
