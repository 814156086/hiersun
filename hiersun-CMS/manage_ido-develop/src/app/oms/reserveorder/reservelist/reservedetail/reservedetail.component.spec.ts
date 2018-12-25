import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservedetailComponent } from './reservedetail.component';

describe('ReservedetailComponent', () => {
  let component: ReservedetailComponent;
  let fixture: ComponentFixture<ReservedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
