import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddartactivityComponent } from './addartactivity.component';

describe('AddartactivityComponent', () => {
  let component: AddartactivityComponent;
  let fixture: ComponentFixture<AddartactivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddartactivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddartactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
