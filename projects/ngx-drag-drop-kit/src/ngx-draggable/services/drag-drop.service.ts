import { Injectable } from '@angular/core';
import { DragRef } from '../drag-ref';
import { DropListRef } from '../drop-list-ref';
import { DropListGroupRef } from '../drop-list-group-ref';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  readonly dragItemsMap = new Map<HTMLElement, DragRef>();
  readonly dropListsMap = new Map<HTMLElement, DropListRef>();

  dropListGroup = new DropListGroupRef();

  clear(): void {
    this.dragItemsMap.clear();
    this.dropListsMap.clear();
    if (this.dropListGroup) {
      this.dropListGroup.currentDragItem = null;
      this.dropListGroup.currentDropList = null;
    }
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

  updateAllRect() {
    for (const list of this.dropListsMap.values()) {
      list.updateDomRect();

      for (const drag of list._draggables.values()) {
        drag.updateDomRect();
      }
    }
  }

  getDragItemIndex(dragItem: DragRef): number {
    if (!dragItem.dropList) return -1;

    return Array.from(dragItem.dropList._draggables.values()).findIndex(x => x.el == dragItem.el);
  }
}
