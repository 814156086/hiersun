import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkupriceComponent } from './skuprice.component';

describe('SkupriceComponent', () => {
  let component: SkupriceComponent;
  let fixture: ComponentFixture<SkupriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkupriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkupriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
