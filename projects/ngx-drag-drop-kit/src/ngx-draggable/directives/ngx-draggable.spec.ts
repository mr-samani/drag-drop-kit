import { NgxDraggableDirective } from './ngx-draggable.directive';
import { DOCUMENT, ElementRef, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('NgxDraggableDirective', () => {
  let el: ElementRef<HTMLDivElement>;
  beforeEach(() => {
    let doc = inject<Document>(DOCUMENT);
    el = new ElementRef<HTMLDivElement>(doc.createElement('div'));
  });
  it('should create an instance', () => {
    const directive = new NgxDraggableDirective(el);
    expect(directive).toBeTruthy();
  });
});
