import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveordersroreComponent } from './reserveordersrore.component';

describe('ReserveordersroreComponent', () => {
  let component: ReserveordersroreComponent;
  let fixture: ComponentFixture<ReserveordersroreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveordersroreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveordersroreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
