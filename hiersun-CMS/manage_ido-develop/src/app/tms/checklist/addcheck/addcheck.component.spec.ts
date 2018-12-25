import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcheckComponent } from './addcheck.component';

describe('AddcheckComponent', () => {
  let component: AddcheckComponent;
  let fixture: ComponentFixture<AddcheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
