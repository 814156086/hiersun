import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgroupcmsComponent } from './mgroupcms.component';

describe('MgroupcmsComponent', () => {
  let component: MgroupcmsComponent;
  let fixture: ComponentFixture<MgroupcmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgroupcmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgroupcmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
