import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupcmsComponent } from './groupcms.component';

describe('GroupcmsComponent', () => {
  let component: GroupcmsComponent;
  let fixture: ComponentFixture<GroupcmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupcmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupcmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
