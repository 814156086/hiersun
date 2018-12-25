import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmodalComponent } from './shipmodal.component';

describe('ShipmodalComponent', () => {
  let component: ShipmodalComponent;
  let fixture: ComponentFixture<ShipmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
