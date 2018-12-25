import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticsCompanyComponent } from './logistics-company.component';

describe('LogisticsCompanyComponent', () => {
  let component: LogisticsCompanyComponent;
  let fixture: ComponentFixture<LogisticsCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogisticsCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticsCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
