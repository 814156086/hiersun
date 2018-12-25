import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpaymediumComponent } from './addpaymedium.component';

describe('AddpaymediumComponent', () => {
  let component: AddpaymediumComponent;
  let fixture: ComponentFixture<AddpaymediumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpaymediumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpaymediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
