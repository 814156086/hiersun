import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtclassifyComponent } from './artlists.component';

describe('ArtclassifyComponent', () => {
  let component: ArtclassifyComponent;
  let fixture: ComponentFixture<ArtclassifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtclassifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtclassifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
