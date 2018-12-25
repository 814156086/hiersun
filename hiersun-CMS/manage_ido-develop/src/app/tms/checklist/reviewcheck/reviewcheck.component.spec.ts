import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewcheckComponent } from './reviewcheck.component';

describe('ReviewcheckComponent', () => {
  let component: ReviewcheckComponent;
  let fixture: ComponentFixture<ReviewcheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewcheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
