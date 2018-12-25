import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddallocateComponent } from './addallocate.component';

describe('AddallocateComponent', () => {
  let component: AddallocateComponent;
  let fixture: ComponentFixture<AddallocateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddallocateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddallocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
