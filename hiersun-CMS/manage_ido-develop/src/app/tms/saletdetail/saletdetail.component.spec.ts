import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaletdetailComponent } from './saletdetail.component';

describe('SaletdetailComponent', () => {
  let component: SaletdetailComponent;
  let fixture: ComponentFixture<SaletdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaletdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaletdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
