import { Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { DragRef } from './drag-ref';

const NGX_DRAG_REGISTER = new InjectionToken('DragRegister');

@Injectable({
  providedIn: 'root',
})
export class DragRegister implements OnDestroy {
  readonly dragItemMap = new Map<HTMLElement, DragRef>();

  ngOnDestroy(): void {
    this.dragItemMap.clear();
  }

  registerDragItem(dragItem: DragRef): void {
    this.dragItemMap.set(dragItem.el, dragItem);
  }

  removeDragItem(dragItem: DragRef): void {
    this.dragItemMap.delete(dragItem.el);
  }
}
