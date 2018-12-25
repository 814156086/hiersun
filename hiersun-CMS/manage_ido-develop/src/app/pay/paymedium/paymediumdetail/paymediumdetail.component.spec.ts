import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymediumdetailComponent } from './paymediumdetail.component';

describe('PaymediumdetailComponent', () => {
  let component: PaymediumdetailComponent;
  let fixture: ComponentFixture<PaymediumdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymediumdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymediumdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
