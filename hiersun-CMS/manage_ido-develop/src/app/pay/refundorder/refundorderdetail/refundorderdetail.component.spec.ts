import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundorderdetailComponent } from './refundorderdetail.component';

describe('RefundorderdetailComponent', () => {
  let component: RefundorderdetailComponent;
  let fixture: ComponentFixture<RefundorderdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundorderdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundorderdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
