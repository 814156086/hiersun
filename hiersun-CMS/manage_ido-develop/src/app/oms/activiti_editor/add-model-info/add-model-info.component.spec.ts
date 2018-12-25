import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModelInfoComponent } from './add-model-info.component';

describe('AddModelInfoComponent', () => {
  let component: AddModelInfoComponent;
  let fixture: ComponentFixture<AddModelInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModelInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
