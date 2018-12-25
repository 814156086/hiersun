import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditstorageComponent } from './editstorage.component';

describe('EditstorageComponent', () => {
  let component: EditstorageComponent;
  let fixture: ComponentFixture<EditstorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditstorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditstorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
