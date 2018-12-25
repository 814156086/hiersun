import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagetemplateComponent } from './pagetemplate.component';

describe('PagetemplateComponent', () => {
  let component: PagetemplateComponent;
  let fixture: ComponentFixture<PagetemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagetemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
