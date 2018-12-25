import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeconedpaymediumComponent } from './seconedpaymedium.component';

describe('SeconedpaymediumComponent', () => {
  let component: SeconedpaymediumComponent;
  let fixture: ComponentFixture<SeconedpaymediumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeconedpaymediumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeconedpaymediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
