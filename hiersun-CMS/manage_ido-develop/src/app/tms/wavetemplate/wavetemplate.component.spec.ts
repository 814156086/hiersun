import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WavetemplateComponent } from './wavetemplate.component';

describe('WavetemplateComponent', () => {
  let component: WavetemplateComponent;
  let fixture: ComponentFixture<WavetemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WavetemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WavetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
