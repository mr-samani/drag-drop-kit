import { inject, Renderer2 } from '@angular/core';
import { IPosition } from './contracts/iposition';
import { DropListRef } from './drop-list-ref';
import { checkBoundX, checkBoundY } from './utils/check-boundary';
import { getXYfromTransform } from './utils/get-transform';
import { DropListGroupRef } from './drop-list-group-ref';

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

  private renderer = inject(Renderer2);
  constructor() {}

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
    if (this.dropListGroup) {
      this.dropListGroup.currentDragItem = this;
      this.dropListGroup.currentDropList = this.dropList;
    }
  }
  dragMove(position: IPosition) {
    const offsetX = position.x - this.previousX;
    const offsetY = position.y - this.previousY;
    this.updatePosition(offsetX, offsetY);
  }

  endDrag() {
    // this.autoScroll.stop();
  }

  private updatePosition(offsetX: number, offsetY: number) {
    const clampedOffsetX = checkBoundX(this.domRect, this.boundaryDomRect, offsetX);
    this.x += clampedOffsetX;

    const clampedOffsetY = checkBoundY(this.domRect, this.boundaryDomRect, offsetY);
    this.y += clampedOffsetY;

    this.previousX = clampedOffsetX + this.previousX;
    this.previousY = clampedOffsetY + this.previousY;

    let transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    this.renderer.setStyle(this.el, 'transform', transform);
    return transform;
  }
}
