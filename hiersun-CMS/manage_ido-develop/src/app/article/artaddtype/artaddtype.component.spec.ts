import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtaddtypeComponent } from './artaddtype.component';

describe('AddfComponent', () => {
  let component: ArtaddtypeComponent;
  let fixture: ComponentFixture<ArtaddtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtaddtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtaddtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
