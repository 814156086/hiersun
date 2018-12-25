import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstorageComponent } from './instorage.component';

describe('InstorageComponent', () => {
  let component: InstorageComponent;
  let fixture: ComponentFixture<InstorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
