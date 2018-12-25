import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopdemandComponent } from './shopdemand.component';

describe('ShopdemandComponent', () => {
  let component: ShopdemandComponent;
  let fixture: ComponentFixture<ShopdemandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopdemandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopdemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
