import { DOCUMENT, EventEmitter, inject } from '@angular/core';
import { DragRef } from './drag-ref';
import { DropListGroupRef } from './drop-list-group-ref';
import { PlaceHolderRef } from './placeholder-ref';
import { NGX_PLACEHOLDER } from './directives/ngx-place-holder.directive';
import { IDropEvent } from './contracts/IDropEvent';

export class DropListRef<T = any> {
  data?: T;
  el!: HTMLElement;
  disableSort: boolean = false;
  connectedTo: HTMLElement[] = [];
  dropListGroup?: DropListGroupRef | null;

  _draggables = new Set<DragRef>();
  _currentIndex = -1;
  domRect!: DOMRect;

  _placeHolderRef = inject(NGX_PLACEHOLDER, { optional: true });
  doc = inject(DOCUMENT);
  onDrop = new EventEmitter<IDropEvent<T>>();
  updateDomRect() {
    this.domRect = this.el.getBoundingClientRect();
  }
  addItem(item: DragRef) {
    this._draggables.add(item);
  }

  removeItem(item: DragRef) {
    this._draggables.delete(item);
  }

  createPlaceHolder(currentDragItem: DragRef, dragOverItem?: DragRef, isAfter = false) {
    if (!this._placeHolderRef) {
      this._placeHolderRef = new PlaceHolderRef();
    }
    const plc = this._placeHolderRef.getElement(currentDragItem);
    if (dragOverItem) {
      dragOverItem.el.insertAdjacentElement(isAfter ? 'afterend' : 'beforebegin', plc);
    } else {
      this.el.appendChild(plc);
    }
  }

  enter(currentDragItem: DragRef, dragOverItem?: DragRef) {
    if (!this._placeHolderRef || !this._placeHolderRef.el) {
      this.createPlaceHolder(currentDragItem, dragOverItem);
    }
    this.el.style.outline = '1px red solid';
    this._placeHolderRef!.el!.style.display = 'block';
    this._currentIndex = -1;
    let i = 0;
    for (let item of this._draggables.values()) {
      if (item.el == currentDragItem.el) {
        this._currentIndex = i;
        break;
      }
      i++;
    }
  }

  exit() {
    this.el.style.outline = 'none';
    if (!this._placeHolderRef || !this._placeHolderRef.el) return;
    this._placeHolderRef.el.style.display = 'none';
  }
}
