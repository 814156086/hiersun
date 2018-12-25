import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CredetailComponent } from './credetail.component';

describe('CredetailComponent', () => {
  let component: CredetailComponent;
  let fixture: ComponentFixture<CredetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CredetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
