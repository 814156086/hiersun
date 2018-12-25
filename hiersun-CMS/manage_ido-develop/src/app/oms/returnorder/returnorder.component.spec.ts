import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnorderComponent } from './returnorder.component';

describe('ReturnorderComponent', () => {
  let component: ReturnorderComponent;
  let fixture: ComponentFixture<ReturnorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
