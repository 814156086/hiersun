import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddstoreComponent } from './addstore.component';

describe('AddstoreComponent', () => {
  let component: AddstoreComponent;
  let fixture: ComponentFixture<AddstoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddstoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
