import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcommodityComponent } from './editcommodity.component';

describe('EditcommodityComponent', () => {
  let component: EditcommodityComponent;
  let fixture: ComponentFixture<EditcommodityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditcommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
