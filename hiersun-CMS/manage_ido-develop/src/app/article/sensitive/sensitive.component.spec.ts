import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensitiveComponent } from './sensitive.component';

describe('StatisticsComponent', () => {
  let component: SensitiveComponent;
  let fixture: ComponentFixture<SensitiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensitiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensitiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
