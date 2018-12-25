import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedreturnComponent } from './rejectedreturn.component';

describe('RejectedreturnComponent', () => {
  let component: RejectedreturnComponent;
  let fixture: ComponentFixture<RejectedreturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedreturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
