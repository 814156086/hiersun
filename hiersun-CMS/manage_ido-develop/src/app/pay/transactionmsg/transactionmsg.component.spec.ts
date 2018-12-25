import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionmsgComponent } from './transactionmsg.component';

describe('TransactionmsgComponent', () => {
  let component: TransactionmsgComponent;
  let fixture: ComponentFixture<TransactionmsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionmsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
