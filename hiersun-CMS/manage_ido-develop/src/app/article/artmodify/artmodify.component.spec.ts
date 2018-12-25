import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtdComponent } from './artd.component';

describe('ArtdComponent', () => {
  let component: ArtdComponent;
  let fixture: ComponentFixture<ArtdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
