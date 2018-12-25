import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpaytypeComponent } from './addpaytype.component';

describe('AddpaytypeComponent', () => {
  let component: AddpaytypeComponent;
  let fixture: ComponentFixture<AddpaytypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpaytypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpaytypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
