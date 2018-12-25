import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImggalleryComponent } from './imggallery.component';

describe('ImggalleryComponent', () => {
  let component: ImggalleryComponent;
  let fixture: ComponentFixture<ImggalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImggalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImggalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
