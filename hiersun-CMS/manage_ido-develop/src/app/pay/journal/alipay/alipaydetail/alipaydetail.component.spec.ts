import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlipaydetailComponent } from './alipaydetail.component';

describe('AlipaydetailComponent', () => {
  let component: AlipaydetailComponent;
  let fixture: ComponentFixture<AlipaydetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlipaydetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlipaydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
