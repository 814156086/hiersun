import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtagComponent } from './addtag.component';

describe('AddtagComponent', () => {
  let component: AddtagComponent;
  let fixture: ComponentFixture<AddtagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddtagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
