import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDemo } from './drag-demo';

describe('DragDemo', () => {
  let component: DragDemo;
  let fixture: ComponentFixture<DragDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(DragDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
