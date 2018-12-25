import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditregionComponent } from './editregion.component';

describe('EditregionComponent', () => {
  let component: EditregionComponent;
  let fixture: ComponentFixture<EditregionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditregionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
