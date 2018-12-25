import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreebiedetailComponent } from './freebiedetail.component';

describe('FreebiedetailComponent', () => {
  let component: FreebiedetailComponent;
  let fixture: ComponentFixture<FreebiedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreebiedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreebiedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
