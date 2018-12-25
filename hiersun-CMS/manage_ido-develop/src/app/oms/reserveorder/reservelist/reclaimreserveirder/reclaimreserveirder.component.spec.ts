import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclaimreserveirderComponent } from './reclaimreserveirder.component';

describe('ReclaimreserveirderComponent', () => {
  let component: ReclaimreserveirderComponent;
  let fixture: ComponentFixture<ReclaimreserveirderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReclaimreserveirderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclaimreserveirderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
