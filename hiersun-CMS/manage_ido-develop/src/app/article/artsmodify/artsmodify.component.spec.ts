import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtsnodifyComponent } from './artsmodify.component';

describe('ArtComponent', () => {
  let component: ArtsnodifyComponent;
  let fixture: ComponentFixture<ArtsnodifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtsnodifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtsnodifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
