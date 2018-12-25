import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtlcommodityComponent } from './dtlcommodity.component';

describe('DtlcommodityComponent', () => {
  let component: DtlcommodityComponent;
  let fixture: ComponentFixture<DtlcommodityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtlcommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtlcommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
