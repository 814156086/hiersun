import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditwavetemplateComponent } from './editwavetemplate.component';

describe('EditwavetemplateComponent', () => {
  let component: EditwavetemplateComponent;
  let fixture: ComponentFixture<EditwavetemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditwavetemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditwavetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
