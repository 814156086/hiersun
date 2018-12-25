import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddswiperComponent } from './addswiper.component';

describe('AddswiperComponent', () => {
  let component: AddswiperComponent;
  let fixture: ComponentFixture<AddswiperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddswiperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddswiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
