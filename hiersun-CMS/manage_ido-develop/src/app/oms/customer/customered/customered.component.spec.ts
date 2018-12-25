import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeredComponent } from './customered.component';

describe('CustomeredComponent', () => {
  let component: CustomeredComponent;
  let fixture: ComponentFixture<CustomeredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomeredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
