import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgiftComponent } from './addgift.component';

describe('AddgiftComponent', () => {
  let component: AddgiftComponent;
  let fixture: ComponentFixture<AddgiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddgiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddgiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
