import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArttagComponent } from './arttag.component';

describe('ArttagComponent', () => {
  let component: ArttagComponent;
  let fixture: ComponentFixture<ArttagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArttagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArttagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
