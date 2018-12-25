import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditchannelComponent } from './editchannel.component';

describe('EditchannelComponent', () => {
  let component: EditchannelComponent;
  let fixture: ComponentFixture<EditchannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditchannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditchannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
