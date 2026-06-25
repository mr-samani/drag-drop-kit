import { Injectable } from '@angular/core';
import { DragRef } from '../drag-ref';
import { DropListRef } from '../drop-list-ref';
import { DropListGroupRef } from '../drop-list-group-ref';
import { IPosition } from '../contracts/IPosition';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  readonly dragItemsMap = new Map<HTMLElement, DragRef>();
  readonly dropListsMap = new Map<HTMLElement, DropListRef>();
  itemsSnapshot: { item: DragRef; rect: DOMRect }[] = [];
  listSnapshot: { item: DropListRef; rect: DOMRect }[] = [];

  dropListGroup = new DropListGroupRef();

  clear(): void {
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

  updateAllRect() {
    for (const list of this.dropListsMap.values()) {
      list.updateDomRect();

      for (const drag of list._draggables.values()) {
        drag.updateDomRect();
      }
    }
    this.listSnapshot = Array.from(this.dropListsMap.values()).map(m => {
      return {
        item: m,
        rect: m.domRect,
      };
    });
    this.itemsSnapshot = Array.from(this.dragItemsMap.values()).map(m => {
      return {
        item: m,
        rect: m.domRect,
      };
    });
  }

  getDragItemIndex(dragItem: DragRef): number {
    if (!dragItem.dropList) return -1;

    return Array.from(dragItem.dropList._draggables.values()).findIndex(x => x.el == dragItem.el);
  }

  getDropListFromPointerPosition(position: IPosition) {
    return this.listSnapshot.find(w => this.insideQuery(w, position))?.item;
  }

  getIndexFromPointerPosition(dropList: DropListRef | undefined | null, position: IPosition): number {
    if (!dropList) return -1;
    return this.itemsSnapshot
      .filter(f => f.item.dropList?.el == dropList.el)
      .findIndex(w => this.insideQuery(w, position));
  }

  private insideQuery(w: { rect: DOMRect }, position: IPosition): boolean {
    return (
      // vertical
      position.x >= w.rect.x &&
      position.x <= w.rect.x + w.rect.width &&
      //horizontal
      position.y >= w.rect.y &&
      position.y <= w.rect.y + w.rect.height
    );
  }
}
