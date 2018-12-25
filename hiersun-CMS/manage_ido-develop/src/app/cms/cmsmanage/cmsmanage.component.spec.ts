import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsmanageComponent } from './cmsmanage.component';

describe('CmsmanageComponent', () => {
  let component: CmsmanageComponent;
  let fixture: ComponentFixture<CmsmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
