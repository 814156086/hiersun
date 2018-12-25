import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreserveactiveComponent } from './addreserveactive.component';

describe('AddreserveactiveComponent', () => {
  let component: AddreserveactiveComponent;
  let fixture: ComponentFixture<AddreserveactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddreserveactiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddreserveactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
