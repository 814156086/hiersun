import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailskuComponent } from './detailsku.component';

describe('DetailskuComponent', () => {
  let component: DetailskuComponent;
  let fixture: ComponentFixture<DetailskuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailskuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailskuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
