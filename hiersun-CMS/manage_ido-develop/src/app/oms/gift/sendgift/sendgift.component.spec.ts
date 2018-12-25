import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendgiftComponent } from './sendgift.component';

describe('SendgiftComponent', () => {
  let component: SendgiftComponent;
  let fixture: ComponentFixture<SendgiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendgiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendgiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
