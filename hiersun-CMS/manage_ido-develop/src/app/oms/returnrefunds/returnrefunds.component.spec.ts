import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnrefundsComponent } from './returnrefunds.component';

describe('ReturnrefundsComponent', () => {
  let component: ReturnrefundsComponent;
  let fixture: ComponentFixture<ReturnrefundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnrefundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnrefundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
