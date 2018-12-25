import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageproComponent } from './storagepro.component';

describe('StorageproComponent', () => {
  let component: StorageproComponent;
  let fixture: ComponentFixture<StorageproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
