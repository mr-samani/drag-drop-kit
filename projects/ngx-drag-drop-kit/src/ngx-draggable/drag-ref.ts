import { DOCUMENT, inject, Renderer2 } from '@angular/core';
import { IPosition } from './contracts/IPosition';
import { DropListRef } from './drop-list-ref';
import { checkBoundX, checkBoundY } from './utils/check-boundary';
import { getXYfromTransform } from './utils/get-transform';
import { DropListGroupRef } from './drop-list-group-ref';
import { IDropEvent } from './contracts/IDropEvent';
import { cloneDragElementInBody } from './utils/clone-drag-element-in-body';
import { DragDropService } from './services/drag-drop.service';

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

  private _dropEvent: IDropEvent | null = null;
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
      this.dropListGroup.currentDragItem = this;
      this.dropListGroup.currentDropList = this.dropList;
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
      this.dropList.createPlaceHolder(this);
      this.dropList.enter();
    }
  }
  dragMove(position: IPosition) {
    const offsetX = position.x - this.previousX;
    const offsetY = position.y - this.previousY;
    this.updatePosition(this.dragItemInBody ?? this.el, offsetX, offsetY);
  }

  endDrag() {
    // this.autoScroll.stop();
    console.log(this._dropEvent);
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
