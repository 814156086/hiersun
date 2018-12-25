import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtcComponent } from './artc.component';

describe('ArtcComponent', () => {
  let component: ArtcComponent;
  let fixture: ComponentFixture<ArtcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
