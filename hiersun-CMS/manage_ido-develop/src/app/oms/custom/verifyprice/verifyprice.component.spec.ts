import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifypriceComponent } from './verifyprice.component';

describe('VerifypriceComponent', () => {
  let component: VerifypriceComponent;
  let fixture: ComponentFixture<VerifypriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifypriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifypriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
