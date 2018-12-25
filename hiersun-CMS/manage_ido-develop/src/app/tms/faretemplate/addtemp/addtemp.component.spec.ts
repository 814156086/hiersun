import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtempComponent } from './addtemp.component';

describe('AddtempComponent', () => {
  let component: AddtempComponent;
  let fixture: ComponentFixture<AddtempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddtempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
