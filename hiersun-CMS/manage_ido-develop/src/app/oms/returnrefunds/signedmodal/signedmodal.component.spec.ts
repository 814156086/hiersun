import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedmodalComponent } from './signedmodal.component';

describe('SignedmodalComponent', () => {
  let component: SignedmodalComponent;
  let fixture: ComponentFixture<SignedmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignedmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
