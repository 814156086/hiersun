import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaretemplateComponent } from './faretemplate.component';

describe('FaretemplateComponent', () => {
  let component: FaretemplateComponent;
  let fixture: ComponentFixture<FaretemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaretemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaretemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
