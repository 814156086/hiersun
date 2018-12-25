import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessmsgdetailComponent } from './businessmsgdetail.component';

describe('BusinessmsgdetailComponent', () => {
  let component: BusinessmsgdetailComponent;
  let fixture: ComponentFixture<BusinessmsgdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessmsgdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessmsgdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
