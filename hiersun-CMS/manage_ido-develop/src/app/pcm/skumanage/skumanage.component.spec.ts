import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkumanageComponent } from './skumanage.component';

describe('SkumanageComponent', () => {
  let component: SkumanageComponent;
  let fixture: ComponentFixture<SkumanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkumanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkumanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
