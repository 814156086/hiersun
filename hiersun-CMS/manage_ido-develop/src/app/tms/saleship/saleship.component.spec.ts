import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleshipComponent } from './saleship.component';

describe('SaleshipComponent', () => {
  let component: SaleshipComponent;
  let fixture: ComponentFixture<SaleshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
