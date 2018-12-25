import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtagproComponent } from './addtagpro.component';

describe('AddtagproComponent', () => {
  let component: AddtagproComponent;
  let fixture: ComponentFixture<AddtagproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddtagproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtagproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
