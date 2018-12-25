import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecustomidComponent } from './updatecustomid.component';

describe('UpdatecustomidComponent', () => {
  let component: UpdatecustomidComponent;
  let fixture: ComponentFixture<UpdatecustomidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatecustomidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatecustomidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
