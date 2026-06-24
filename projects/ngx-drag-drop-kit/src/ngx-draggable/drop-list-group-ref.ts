import { DragRef } from './drag-ref';
import { DropListRef } from './drop-list-ref';

export class DropListGroupRef<T = any> {
  el!: HTMLElement;
  /** Drop lists registered inside the group. */
  readonly _items = new Set<T>();

  currentDragItem?: DragRef | null;
  currentDropList?: DropListRef | null;
  readonly dragItemsMap = new Map<HTMLElement, DragRef>();
  readonly dropListsMap = new Map<HTMLElement, DropListRef>();

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
}
