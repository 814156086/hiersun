import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditreagioComponent } from './editreagio.component';

describe('EditreagioComponent', () => {
  let component: EditreagioComponent;
  let fixture: ComponentFixture<EditreagioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditreagioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditreagioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
