import { DropListRef } from './drop-list-ref';

export class DragRef<T = any> {
  data?: T;
  el!: HTMLElement;
  isDragging: boolean = false;
  dropList?: DropListRef | null;
}
