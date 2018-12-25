import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WavalistComponent } from './wavalist.component';

describe('WavalistComponent', () => {
  let component: WavalistComponent;
  let fixture: ComponentFixture<WavalistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WavalistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WavalistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
