import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundmsgComponent } from './refundmsg.component';

describe('RefundmsgComponent', () => {
  let component: RefundmsgComponent;
  let fixture: ComponentFixture<RefundmsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundmsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
