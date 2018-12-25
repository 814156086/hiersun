import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtactivityComponent } from './artactivity.component';

describe('ArtactivityComponent', () => {
  let component: ArtactivityComponent;
  let fixture: ComponentFixture<ArtactivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtactivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
