import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessmsgComponent } from './businessmsg.component';

describe('BusinessmsgComponent', () => {
  let component: BusinessmsgComponent;
  let fixture: ComponentFixture<BusinessmsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessmsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
