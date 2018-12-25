import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdslistComponent } from './prodslist.component';

describe('ProdslistComponent', () => {
  let component: ProdslistComponent;
  let fixture: ComponentFixture<ProdslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
