import { DOCUMENT, inject } from '@angular/core';
import { DragRef } from './drag-ref';
import { DropListGroupRef } from './drop-list-group-ref';
import { NGX_PLACEHOLDER } from '../public-api';
import { PlaceHolderRef } from './placeholder-ref';

export class DropListRef<T = any> {
  data?: T;
  el!: HTMLElement;
  disableSort: boolean = false;
  connectedTo: HTMLElement[] = [];
  dropListGroup?: DropListGroupRef | null;

  _draggables = new Set<DragRef>();
  domRect!: DOMRect;

  _placeHolderRef = inject(NGX_PLACEHOLDER, { optional: true });
  doc = inject(DOCUMENT);
  private showPlaceholder = false;
  updateDomRect() {
    this.domRect = this.el.getBoundingClientRect();
  }
  addItem(item: DragRef) {
    this._draggables.add(item);
  }

  removeItem(item: DragRef) {
    this._draggables.delete(item);
  }

  createPlaceHolder(dragOverItem: DragRef, isAfter = false) {
    if (!this._placeHolderRef) {
      this._placeHolderRef = new PlaceHolderRef();
    }
    if (dragOverItem) {
      dragOverItem.el.insertAdjacentElement(
        isAfter ? 'afterend' : 'beforebegin',
        this._placeHolderRef.getElement(this.doc)
      );
    } else {
      this.el.appendChild(this._placeHolderRef.getElement(this.doc));
    }
    this.showPlaceholder = true;
  }

  enter() {
    if (this.showPlaceholder) return;
    this.showPlaceholder = true;
    this.el.style.display = 'block';
  }

  exit() {
    if (!this.showPlaceholder) return;
    this.el.style.display = 'none';
  }
}
