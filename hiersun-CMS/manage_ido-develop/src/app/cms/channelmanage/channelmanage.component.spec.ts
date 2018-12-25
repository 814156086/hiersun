import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelmanageComponent } from './channelmanage.component';

describe('ChannelmanageComponent', () => {
  let component: ChannelmanageComponent;
  let fixture: ComponentFixture<ChannelmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
