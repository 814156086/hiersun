import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcmtComponent } from './addcmt.component';

describe('AddcmtComponent', () => {
  let component: AddcmtComponent;
  let fixture: ComponentFixture<AddcmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
