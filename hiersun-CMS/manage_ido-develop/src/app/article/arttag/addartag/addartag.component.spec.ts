import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddartagComponent } from './addartag.component';

describe('AddartagComponent', () => {
  let component: AddartagComponent;
  let fixture: ComponentFixture<AddartagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddartagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddartagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
