import { Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { DragRef } from './drag-ref';
import { DropListRef } from './drop-list-ref';

const NGX_DRAG_REGISTER = new InjectionToken('DragRegister');

@Injectable({
  providedIn: 'root',
})
export class DragRegister implements OnDestroy {
  readonly dragItemsMap = new Map<HTMLElement, DragRef>();
  readonly dropListsMap = new Map<HTMLElement, DropListRef>();

  ngOnDestroy(): void {
    this.dragItemsMap.clear();
    this.dropListsMap.clear();
  }

  registerDragItem(dragItem: DragRef): void {
    this.dragItemsMap.set(dragItem.el, dragItem);
  }

  removeDragItem(dragItem: DragRef): void {
    this.dragItemsMap.delete(dragItem.el);
  }

  registerDropList(dropList: DropListRef) {
    this.dropListsMap.set(dropList.el, dropList);
  }
  removeDropList(dropList: DropListRef) {
    this.dropListsMap.delete(dropList.el);
  }


  
}
