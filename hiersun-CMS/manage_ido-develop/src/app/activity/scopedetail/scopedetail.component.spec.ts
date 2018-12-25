import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopedetailComponent } from './scopedetail.component';

describe('ScopedetailComponent', () => {
  let component: ScopedetailComponent;
  let fixture: ComponentFixture<ScopedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScopedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScopedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
