import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryreservelistComponent } from './recoveryreservelist.component';

describe('RecoveryreservelistComponent', () => {
  let component: RecoveryreservelistComponent;
  let fixture: ComponentFixture<RecoveryreservelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryreservelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryreservelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
