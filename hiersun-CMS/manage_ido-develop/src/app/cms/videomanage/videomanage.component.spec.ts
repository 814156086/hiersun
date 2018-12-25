import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideomanageComponent } from './videomanage.component';

describe('VideomanageComponent', () => {
  let component: VideomanageComponent;
  let fixture: ComponentFixture<VideomanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideomanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideomanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
