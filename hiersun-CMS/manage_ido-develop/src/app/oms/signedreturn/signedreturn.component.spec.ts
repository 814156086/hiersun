import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedreturnComponent } from './signedreturn.component';

describe('SignedreturnComponent', () => {
  let component: SignedreturnComponent;
  let fixture: ComponentFixture<SignedreturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignedreturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
