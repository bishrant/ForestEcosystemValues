import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintmapComponent } from './printmap.component';

describe('PrintmapComponent', () => {
  let component: PrintmapComponent;
  let fixture: ComponentFixture<PrintmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
