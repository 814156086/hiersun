import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionmsgdetailComponent } from './transactionmsgdetail.component';

describe('TransactionmsgdetailComponent', () => {
  let component: TransactionmsgdetailComponent;
  let fixture: ComponentFixture<TransactionmsgdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionmsgdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionmsgdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
