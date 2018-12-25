import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabeldetailComponent } from './labeldetail.component';

describe('LabeldetailComponent', () => {
  let component: LabeldetailComponent;
  let fixture: ComponentFixture<LabeldetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabeldetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabeldetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
