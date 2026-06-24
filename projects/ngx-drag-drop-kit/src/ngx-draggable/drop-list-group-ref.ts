import { DragRef } from './drag-ref';
import { DropListRef } from './drop-list-ref';

export class DropListGroupRef<T = any> {
  el!: HTMLElement;
  /** Drop lists registered inside the group. */
  readonly _items = new Set<T>();

  currentDragItem?: DragRef | null;
  currentDropList?: DropListRef | null;
}
