import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservelistComponent } from './reservelist.component';

describe('ReservelistComponent', () => {
  let component: ReservelistComponent;
  let fixture: ComponentFixture<ReservelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
