import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRelationsComponent } from './item-relations.component';

describe('ItemRelationsComponent', () => {
  let component: ItemRelationsComponent;
  let fixture: ComponentFixture<ItemRelationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemRelationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
