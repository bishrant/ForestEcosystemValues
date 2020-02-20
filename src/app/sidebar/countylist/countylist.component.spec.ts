import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountylistComponent } from './countylist.component';

describe('CountylistComponent', () => {
  let component: CountylistComponent;
  let fixture: ComponentFixture<CountylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
