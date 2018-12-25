import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoredetailComponent } from './scoredetail.component';

describe('ScoredetailComponent', () => {
  let component: ScoredetailComponent;
  let fixture: ComponentFixture<ScoredetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoredetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoredetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
