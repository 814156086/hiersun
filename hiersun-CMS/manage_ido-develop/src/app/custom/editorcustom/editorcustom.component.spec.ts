import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorcustomComponent } from './editorcustom.component';

describe('EditorcustomComponent', () => {
  let component: EditorcustomComponent;
  let fixture: ComponentFixture<EditorcustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorcustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorcustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
