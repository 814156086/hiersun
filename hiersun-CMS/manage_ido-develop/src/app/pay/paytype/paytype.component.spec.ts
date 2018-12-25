import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytypeComponent } from './paytype.component';

describe('PaytypeComponent', () => {
  let component: PaytypeComponent;
  let fixture: ComponentFixture<PaytypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
