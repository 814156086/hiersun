import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditacountComponent } from './editacount.component';

describe('EditacountComponent', () => {
  let component: EditacountComponent;
  let fixture: ComponentFixture<EditacountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditacountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditacountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
