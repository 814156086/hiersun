import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoptotalscoreComponent } from './shoptotalscore.component';

describe('ShoptotalscoreComponent', () => {
  let component: ShoptotalscoreComponent;
  let fixture: ComponentFixture<ShoptotalscoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoptotalscoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoptotalscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
