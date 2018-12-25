import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplydetailComponent } from './applydetail.component';

describe('ApplydetailComponent', () => {
  let component: ApplydetailComponent;
  let fixture: ComponentFixture<ApplydetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplydetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
