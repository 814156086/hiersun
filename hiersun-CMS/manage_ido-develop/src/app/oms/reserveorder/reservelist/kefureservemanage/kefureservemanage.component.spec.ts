import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KefureservemanageComponent } from './kefureservemanage.component';

describe('KefureservemanageComponent', () => {
  let component: KefureservemanageComponent;
  let fixture: ComponentFixture<KefureservemanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KefureservemanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KefureservemanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
