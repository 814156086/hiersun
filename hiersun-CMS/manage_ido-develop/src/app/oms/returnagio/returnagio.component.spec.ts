import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnagioComponent } from './returnagio.component';

describe('ReturnagioComponent', () => {
  let component: ReturnagioComponent;
  let fixture: ComponentFixture<ReturnagioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnagioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnagioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
