import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuledetailComponent } from './ruledetail.component';

describe('RuledetailComponent', () => {
  let component: RuledetailComponent;
  let fixture: ComponentFixture<RuledetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuledetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuledetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
