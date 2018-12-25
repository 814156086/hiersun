import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperadminComponent } from './swiperadmin.component';

describe('SwiperadminComponent', () => {
  let component: SwiperadminComponent;
  let fixture: ComponentFixture<SwiperadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwiperadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
