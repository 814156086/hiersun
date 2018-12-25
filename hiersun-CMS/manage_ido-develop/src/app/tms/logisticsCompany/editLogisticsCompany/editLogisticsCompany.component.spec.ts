import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLogisticsCompanyComponent } from './editLogisticsCompany.component';

describe('EditstorageComponent', () => {
  let component: EditLogisticsCompanyComponent;
  let fixture: ComponentFixture<EditLogisticsCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLogisticsCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLogisticsCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
