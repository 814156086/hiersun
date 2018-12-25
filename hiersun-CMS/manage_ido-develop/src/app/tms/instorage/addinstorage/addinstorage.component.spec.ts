import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddinstorageComponent } from './addinstorage.component';

describe('AddinstorageComponent', () => {
  let component: AddinstorageComponent;
  let fixture: ComponentFixture<AddinstorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddinstorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddinstorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
