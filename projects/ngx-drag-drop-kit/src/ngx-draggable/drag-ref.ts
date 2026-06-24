import { inject } from '@angular/core';
import { NGX_DROPLIST } from './tokens/drop-list.token';

export class DragRef<T = any> {
  data?: T;
  _domRect?: DOMRect;
  el!: HTMLElement;
  isDragging: boolean = false;
  dropListContainer = inject(NGX_DROPLIST, { skipSelf: true, optional: true });
}
