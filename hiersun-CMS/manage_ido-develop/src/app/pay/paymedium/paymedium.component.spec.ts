import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymediumComponent } from './paymedium.component';

describe('PaymediumComponent', () => {
  let component: PaymediumComponent;
  let fixture: ComponentFixture<PaymediumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymediumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
