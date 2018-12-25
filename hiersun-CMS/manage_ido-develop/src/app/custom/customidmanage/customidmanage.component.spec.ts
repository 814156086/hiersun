import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomidmanageComponent } from './customidmanage.component';

describe('CustomidmanageComponent', () => {
  let component: CustomidmanageComponent;
  let fixture: ComponentFixture<CustomidmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomidmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomidmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
