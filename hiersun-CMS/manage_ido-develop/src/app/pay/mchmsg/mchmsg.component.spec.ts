import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MchmsgComponent } from './mchmsg.component';

describe('MchmsgComponent', () => {
  let component: MchmsgComponent;
  let fixture: ComponentFixture<MchmsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MchmsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MchmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
