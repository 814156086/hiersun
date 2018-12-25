import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservestatusComponent } from './reservestatus.component';

describe('ReservestatusComponent', () => {
  let component: ReservestatusComponent;
  let fixture: ComponentFixture<ReservestatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservestatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservestatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
