import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModelInfoComponent } from './edit-model-info.component';

describe('EditModelInfoComponent', () => {
  let component: EditModelInfoComponent;
  let fixture: ComponentFixture<EditModelInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModelInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
