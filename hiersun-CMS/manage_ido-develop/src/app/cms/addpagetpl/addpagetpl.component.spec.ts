import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpagetplComponent } from './addpagetpl.component';

describe('AddpagetplComponent', () => {
  let component: AddpagetplComponent;
  let fixture: ComponentFixture<AddpagetplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpagetplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpagetplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
