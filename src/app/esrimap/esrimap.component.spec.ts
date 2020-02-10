import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsrimapComponent } from './esrimap.component';

describe('EsrimapComponent', () => {
  let component: EsrimapComponent;
  let fixture: ComponentFixture<EsrimapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsrimapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsrimapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
