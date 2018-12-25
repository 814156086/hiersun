import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveactiveComponent } from './reserveactive.component';

describe('ReserveactiveComponent', () => {
  let component: ReserveactiveComponent;
  let fixture: ComponentFixture<ReserveactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveactiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
