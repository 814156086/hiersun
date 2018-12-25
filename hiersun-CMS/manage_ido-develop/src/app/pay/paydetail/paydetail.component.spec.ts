import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaydetailComponent } from './paydetail.component';

describe('PaydetailComponent', () => {
  let component: PaydetailComponent;
  let fixture: ComponentFixture<PaydetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaydetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
