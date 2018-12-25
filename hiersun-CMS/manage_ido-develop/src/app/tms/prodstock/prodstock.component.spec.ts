import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdstockComponent } from './prodstock.component';

describe('ProdstockComponent', () => {
  let component: ProdstockComponent;
  let fixture: ComponentFixture<ProdstockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdstockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
