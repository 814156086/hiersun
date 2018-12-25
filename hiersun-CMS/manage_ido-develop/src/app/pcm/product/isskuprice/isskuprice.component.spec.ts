import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsskupriceComponent } from './isskuprice.component';

describe('IsskupriceComponent', () => {
  let component: IsskupriceComponent;
  let fixture: ComponentFixture<IsskupriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsskupriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsskupriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
