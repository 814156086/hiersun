import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreagioComponent } from './addreagio.component';

describe('AddreagioComponent', () => {
  let component: AddreagioComponent;
  let fixture: ComponentFixture<AddreagioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddreagioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddreagioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
