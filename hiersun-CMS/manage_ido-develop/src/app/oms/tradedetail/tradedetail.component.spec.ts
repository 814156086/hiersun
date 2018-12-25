import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradedetailComponent } from './tradedetail.component';

describe('TradedetailComponent', () => {
  let component: TradedetailComponent;
  let fixture: ComponentFixture<TradedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
