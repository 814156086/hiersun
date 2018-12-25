import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagemanageComponent } from './pagemanage.component';

describe('PagemanageComponent', () => {
  let component: PagemanageComponent;
  let fixture: ComponentFixture<PagemanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagemanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagemanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
