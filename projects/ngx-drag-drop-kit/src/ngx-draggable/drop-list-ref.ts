import { DropListGroupRef } from './drop-list-group-ref';

export class DropListRef<T = any> {
  data?: T;
  el!: HTMLElement;
  dropListGroup?: DropListGroupRef | null;
}
