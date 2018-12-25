import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintepmComponent } from './printepm.component';

describe('PrintepmComponent', () => {
  let component: PrintepmComponent;
  let fixture: ComponentFixture<PrintepmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintepmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintepmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
