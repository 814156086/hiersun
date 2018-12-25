import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedmodalComponent } from './rejectedmodal.component';

describe('RejectedmodalComponent', () => {
  let component: RejectedmodalComponent;
  let fixture: ComponentFixture<RejectedmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
