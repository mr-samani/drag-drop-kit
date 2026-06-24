import { inject } from '@angular/core';
import { NGX_DROPLIST_GROUP } from '../public-api';

export class DropListRef<T = any[]> {
  data?: T;
  el!: HTMLElement;
  groupContainer = inject(NGX_DROPLIST_GROUP, { skipSelf: true, optional: true });
}
