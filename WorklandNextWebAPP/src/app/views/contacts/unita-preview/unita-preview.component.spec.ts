import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitaPreviewComponent } from './unita-preview.component';

describe('UnitaPreviewComponent', () => {
  let component: UnitaPreviewComponent;
  let fixture: ComponentFixture<UnitaPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitaPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitaPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
