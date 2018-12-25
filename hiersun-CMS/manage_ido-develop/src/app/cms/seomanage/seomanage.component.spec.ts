import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeomanageComponent } from './seomanage.component';

describe('SeomanageComponent', () => {
  let component: SeomanageComponent;
  let fixture: ComponentFixture<SeomanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeomanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeomanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
