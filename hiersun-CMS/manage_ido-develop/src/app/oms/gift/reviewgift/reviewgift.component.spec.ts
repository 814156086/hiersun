import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewgiftComponent } from './reviewgift.component';

describe('ReviewgiftComponent', () => {
  let component: ReviewgiftComponent;
  let fixture: ComponentFixture<ReviewgiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewgiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewgiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
