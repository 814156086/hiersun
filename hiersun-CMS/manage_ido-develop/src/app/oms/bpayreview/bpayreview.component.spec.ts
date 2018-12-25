import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpayreviewComponent } from './bpayreview.component';

describe('BpayreviewComponent', () => {
  let component: BpayreviewComponent;
  let fixture: ComponentFixture<BpayreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpayreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpayreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
