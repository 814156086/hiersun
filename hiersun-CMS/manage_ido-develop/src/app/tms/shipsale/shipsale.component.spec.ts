import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipsaleComponent } from './shipsale.component';

describe('ShipsaleComponent', () => {
  let component: ShipsaleComponent;
  let fixture: ComponentFixture<ShipsaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipsaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
