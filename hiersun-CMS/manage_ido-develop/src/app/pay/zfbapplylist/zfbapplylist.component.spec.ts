import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfbapplylistComponent } from './zfbapplylist.component';

describe('ZfbapplylistComponent', () => {
  let component: ZfbapplylistComponent;
  let fixture: ComponentFixture<ZfbapplylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZfbapplylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZfbapplylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
