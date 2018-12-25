import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundmsgdetailComponent } from './refundmsgdetail.component';

describe('RefundmsgdetailComponent', () => {
  let component: RefundmsgdetailComponent;
  let fixture: ComponentFixture<RefundmsgdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundmsgdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundmsgdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
