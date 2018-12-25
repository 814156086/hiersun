import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseproComponent } from './choosepro.component';

describe('ChooseproComponent', () => {
  let component: ChooseproComponent;
  let fixture: ComponentFixture<ChooseproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
