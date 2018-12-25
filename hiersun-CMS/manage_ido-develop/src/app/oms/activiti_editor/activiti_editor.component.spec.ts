import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiEditorComponent } from './activiti_editor.component';

describe('ActivitiEditorComponent', () => {
  let component: ActivitiEditorComponent;
  let fixture: ComponentFixture<ActivitiEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
