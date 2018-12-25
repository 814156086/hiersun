import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WechatdetailComponent } from './wechatdetail.component';

describe('WechatdetailComponent', () => {
  let component: WechatdetailComponent;
  let fixture: ComponentFixture<WechatdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WechatdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WechatdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
