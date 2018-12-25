import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WxapplyComponent } from './wxapply.component';

describe('WxapplyComponent', () => {
  let component: WxapplyComponent;
  let fixture: ComponentFixture<WxapplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WxapplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WxapplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
