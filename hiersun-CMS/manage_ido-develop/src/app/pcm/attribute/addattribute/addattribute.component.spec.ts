import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddattributeComponent } from './addattribute.component';

describe('AddattributeComponent', () => {
  let component: AddattributeComponent;
  let fixture: ComponentFixture<AddattributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddattributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddattributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
