import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DitchmanageComponent } from './ditchmanage.component';

describe('DitchmanageComponent', () => {
  let component: DitchmanageComponent;
  let fixture: ComponentFixture<DitchmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DitchmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DitchmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
