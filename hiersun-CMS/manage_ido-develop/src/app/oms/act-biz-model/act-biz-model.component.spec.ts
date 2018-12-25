import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActBizModelComponent } from './act-biz-model.component';

describe('ActBizModelComponent', () => {
  let component: ActBizModelComponent;
  let fixture: ComponentFixture<ActBizModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActBizModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActBizModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
