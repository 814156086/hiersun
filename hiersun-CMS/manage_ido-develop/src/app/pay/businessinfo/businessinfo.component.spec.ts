import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessinfoComponent } from './businessinfo.component';

describe('BusinessinfoComponent', () => {
  let component: BusinessinfoComponent;
  let fixture: ComponentFixture<BusinessinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
