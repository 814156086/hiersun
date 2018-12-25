import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KefureservedetailComponent } from './kefureservedetail.component';

describe('KefureservedetailComponent', () => {
  let component: KefureservedetailComponent;
  let fixture: ComponentFixture<KefureservedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KefureservedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KefureservedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
