import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FragmenttmpComponent } from './fragmenttmp.component';

describe('FragmenttmpComponent', () => {
  let component: FragmenttmpComponent;
  let fixture: ComponentFixture<FragmenttmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FragmenttmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FragmenttmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
