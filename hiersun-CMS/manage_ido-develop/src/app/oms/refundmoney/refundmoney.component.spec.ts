import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundmoneyComponent } from './refundmoney.component';

describe('RefundmoneyComponent', () => {
  let component: RefundmoneyComponent;
  let fixture: ComponentFixture<RefundmoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundmoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundmoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
