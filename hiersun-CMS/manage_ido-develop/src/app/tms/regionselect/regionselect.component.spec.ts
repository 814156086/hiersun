import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionselectComponent } from './regionselect.component';

describe('RegionselectComponent', () => {
  let component: RegionselectComponent;
  let fixture: ComponentFixture<RegionselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
