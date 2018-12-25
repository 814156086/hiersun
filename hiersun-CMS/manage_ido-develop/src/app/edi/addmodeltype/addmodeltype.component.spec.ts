import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodeltypeComponent } from './addmodeltype.component';

describe('AddmodeltypeComponent', () => {
  let component: AddmodeltypeComponent;
  let fixture: ComponentFixture<AddmodeltypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmodeltypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmodeltypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
