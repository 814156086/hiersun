import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreaccountComponent } from './storeaccount.component';

describe('StoreaccountComponent', () => {
  let component: StoreaccountComponent;
  let fixture: ComponentFixture<StoreaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
