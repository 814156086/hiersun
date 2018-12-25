import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipreturnComponent } from './shipreturn.component';

describe('ShipreturnComponent', () => {
  let component: ShipreturnComponent;
  let fixture: ComponentFixture<ShipreturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipreturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
