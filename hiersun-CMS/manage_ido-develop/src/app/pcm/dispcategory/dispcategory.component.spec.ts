import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispcategoryComponent } from './dispcategory.component';

describe('DispcategoryComponent', () => {
  let component: DispcategoryComponent;
  let fixture: ComponentFixture<DispcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
