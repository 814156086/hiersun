import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalorderComponent } from './abnormalorder.component';

describe('AbnormalorderComponent', () => {
  let component: AbnormalorderComponent;
  let fixture: ComponentFixture<AbnormalorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbnormalorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
