import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymanageComponent } from './paymanage.component';

describe('PaymanageComponent', () => {
  let component: PaymanageComponent;
  let fixture: ComponentFixture<PaymanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
