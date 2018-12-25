import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewagioComponent } from './reviewagio.component';

describe('ReviewagioComponent', () => {
  let component: ReviewagioComponent;
  let fixture: ComponentFixture<ReviewagioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewagioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewagioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
