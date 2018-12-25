import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundorderComponent } from './refundorder.component';

describe('RefundorderComponent', () => {
  let component: RefundorderComponent;
  let fixture: ComponentFixture<RefundorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
