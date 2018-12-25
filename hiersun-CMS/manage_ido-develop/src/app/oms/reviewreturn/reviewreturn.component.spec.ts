import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewreturnComponent } from './reviewreturn.component';

describe('ReviewreturnComponent', () => {
  let component: ReviewreturnComponent;
  let fixture: ComponentFixture<ReviewreturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewreturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
