import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemrelationComponent } from './itemrelation.component';

describe('ItemrelationComponent', () => {
  let component: ItemrelationComponent;
  let fixture: ComponentFixture<ItemrelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemrelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemrelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
