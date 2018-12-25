import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreItemCodeTypesComponent } from './store-item-code-types.component';

describe('StoreItemCodeTypesComponent', () => {
  let component: StoreItemCodeTypesComponent;
  let fixture: ComponentFixture<StoreItemCodeTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreItemCodeTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreItemCodeTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
