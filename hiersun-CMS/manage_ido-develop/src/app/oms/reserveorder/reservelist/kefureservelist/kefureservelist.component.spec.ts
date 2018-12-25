import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KefureservelistComponent } from './kefureservelist.component';

describe('KefureservelistComponent', () => {
  let component: KefureservelistComponent;
  let fixture: ComponentFixture<KefureservelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KefureservelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KefureservelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
