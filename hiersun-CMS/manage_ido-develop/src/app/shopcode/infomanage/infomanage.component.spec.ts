import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfomanageComponent } from './infomanage.component';

describe('InfomanageComponent', () => {
  let component: InfomanageComponent;
  let fixture: ComponentFixture<InfomanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfomanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfomanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
