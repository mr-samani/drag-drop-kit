import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDragDropKit } from './ngx-drag-drop-kit';

describe('NgxDragDropKit', () => {
  let component: NgxDragDropKit;
  let fixture: ComponentFixture<NgxDragDropKit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxDragDropKit],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxDragDropKit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
