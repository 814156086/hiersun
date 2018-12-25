import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftmodalComponent } from './giftmodal.component';

describe('GiftmodalComponent', () => {
  let component: GiftmodalComponent;
  let fixture: ComponentFixture<GiftmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
