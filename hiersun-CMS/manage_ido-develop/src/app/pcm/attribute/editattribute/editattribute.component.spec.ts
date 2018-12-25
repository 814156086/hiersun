import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditattributeComponent } from './editattribute.component';

describe('EditattributeComponent', () => {
  let component: EditattributeComponent;
  let fixture: ComponentFixture<EditattributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditattributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditattributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
