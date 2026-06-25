import { DOCUMENT, inject, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { IPosition } from './contracts/IPosition';
import { DropListRef } from './drop-list-ref';
import { checkBoundX, checkBoundY } from './utils/check-boundary';
import { getXYfromTransform } from './utils/get-transform';
import { DropListGroupRef } from './drop-list-group-ref';
import { IDropEvent } from './contracts/IDropEvent';
import { cloneDragElementInBody } from './utils/clone-drag-element-in-body';
import { DragDropService } from './services/drag-drop.service';
// interface DragItemPosition {
//   dragRef: DragRef;
//   element: HTMLElement;
//   clientRect: DOMRect;

//   initialTransform: string;
//   offset: number;
// }

export class DragRef<T = any> {
  data?: T;
  el!: HTMLElement;
  isDragging: boolean = false;
  dropList?: DropListRef | null;
  dropListGroup?: DropListGroupRef | null;

  domRect!: DOMRect;
  index: number = -1;

  boundary?: HTMLElement;
  private boundaryDomRect?: DOMRect;
  x: number = 0;
  y: number = 0;
  private previousX: number = 0;
  private previousY: number = 0;
  private previousDragELDisplay = '';

  private _dropEvent: IDropEvent | null = null;
  private _currentIndex = -1;
  private _currentDropList?: DropListRef | null = null;
  private dragItemInBody?: HTMLElement;
  private renderer = inject(Renderer2);
  private doc = inject(DOCUMENT);
  private dragDropService = inject(DragDropService);
  constructor() {}

  withDropList(dropList: DropListRef | null): this {
    if (this.dropList === dropList) {
      return this;
    }

    // از لیست قبلی خارج شو
    this.dropList?.removeItem(this);

    // لیست جدید
    this.dropList = dropList;

    // وارد لیست جدید شو
    this.dropList?.addItem(this);

    return this;
  }

  init() {
    const xy = getXYfromTransform(this.el);
    this.x = xy.x;
    this.y = xy.y;
    this.updateDomRect();
  }
  updateDomRect() {
    this.domRect = this.el.getBoundingClientRect();
    if (this.boundary) {
      this.boundaryDomRect = this.boundary.getBoundingClientRect();
    }
  }
  pointerDown(position: IPosition) {
    this.previousX = position.x;
    this.previousY = position.y;
    // update all dowm rects
  }
  startDrag(_position: IPosition) {
    // this.autoScroll.handleAutoScroll(ev);
    if (this.dropListGroup && this.dropList) {
      this._currentDropList = this.dropList;
      this.dragDropService.updateAllRect();
      const index = this.dragDropService.getDragItemIndex(this);
      this._dropEvent = {
        previousIndex: index,
        previousContainer: this.dropList,
        container: this.dropList,
        currentIndex: index,
        item: this,
      };
      this.dragItemInBody = cloneDragElementInBody(this.el, this.domRect);
      this.doc.body.appendChild(this.dragItemInBody);
      this.dropList.createPlaceHolder(this, this);
      //hide main drag element
      this.previousDragELDisplay = this.el.style.display;
      this.renderer.setStyle(this.el, 'display', 'none', RendererStyleFlags2.Important);
      this.dropList.enter(this);
    }
  }
  dragMove(position: IPosition) {
    const offsetX = position.x - this.previousX;
    const offsetY = position.y - this.previousY;
    this.updatePosition(this.dragItemInBody ?? this.el, offsetX, offsetY);

    let list = this.dragDropService.getDropListFromPointerPosition(position);
    if (this.dropListGroup && this._currentDropList != list) {
      this._currentDropList?.exit();
      this._currentDropList = list;
      this._currentDropList?.enter(this);
    }
    if (this.dropListGroup) {
      this._currentIndex = this.dragDropService.getIndexFromPointerPosition(this._currentDropList, position);
      if (this._currentIndex == -1 && this._currentDropList) {
        this._currentIndex = this._currentDropList._draggables.size;
      }
    }
  }

  endDrag() {
    // this.autoScroll.stop();
    if (this.dropList) {
      this.dragDropService.listSnapshot.forEach(x => x.item._placeHolderRef?.remove());
      this.el.style.display = this.previousDragELDisplay;
      this.dragItemInBody?.remove();
      this.previousX = 0;
      this.previousY = 0;
      this.x = 0;
      this.y = 0;
    }

    if (this._dropEvent && this._currentDropList) {
      this._dropEvent.currentIndex = this._currentIndex;
      this._dropEvent.container = this._currentDropList;
      this._currentDropList.exit();
      this._currentDropList.onDrop.emit(this._dropEvent);
      console.log(this._dropEvent);
    }
  }

  private updatePosition(el: HTMLElement, offsetX: number, offsetY: number) {
    const clampedOffsetX = checkBoundX(this.domRect, this.boundaryDomRect, offsetX);
    this.x += clampedOffsetX;

    const clampedOffsetY = checkBoundY(this.domRect, this.boundaryDomRect, offsetY);
    this.y += clampedOffsetY;

    this.previousX = clampedOffsetX + this.previousX;
    this.previousY = clampedOffsetY + this.previousY;

    let transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    this.renderer.setStyle(el, 'transform', transform);
    return transform;
  }
}
