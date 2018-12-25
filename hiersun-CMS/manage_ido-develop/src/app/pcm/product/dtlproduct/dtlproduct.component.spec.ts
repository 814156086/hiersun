import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtlproductComponent } from './dtlproduct.component';

describe('DtlproductComponent', () => {
  let component: DtlproductComponent;
  let fixture: ComponentFixture<DtlproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtlproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtlproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
