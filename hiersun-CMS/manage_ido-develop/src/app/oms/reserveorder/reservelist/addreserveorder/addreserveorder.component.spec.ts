import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreserveorderComponent } from './addreserveorder.component';

describe('AddreserveorderComponent', () => {
  let component: AddreserveorderComponent;
  let fixture: ComponentFixture<AddreserveorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddreserveorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddreserveorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
