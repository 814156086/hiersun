import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcheckComponent } from './editcheck.component';

describe('EditcheckComponent', () => {
  let component: EditcheckComponent;
  let fixture: ComponentFixture<EditcheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditcheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
