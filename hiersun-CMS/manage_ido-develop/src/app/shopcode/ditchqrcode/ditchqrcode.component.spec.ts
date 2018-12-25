import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DitchqrcodeComponent } from './ditchqrcode.component';

describe('DitchqrcodeComponent', () => {
  let component: DitchqrcodeComponent;
  let fixture: ComponentFixture<DitchqrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DitchqrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DitchqrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
