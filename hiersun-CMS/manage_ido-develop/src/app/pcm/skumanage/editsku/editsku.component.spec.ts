import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditskuComponent } from './editsku.component';

describe('EditskuComponent', () => {
  let component: EditskuComponent;
  let fixture: ComponentFixture<EditskuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditskuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditskuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
