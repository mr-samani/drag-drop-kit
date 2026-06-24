import { TemplateRef } from '@angular/core';
import { DropListRef } from './drop-list-ref';

export class PlaceHolderRef {
  tpl!: TemplateRef<HTMLElement>;
  dropList?: DropListRef | null;
  el?: HTMLElement;

   getElement(doc:Document): HTMLElement {
    if (!this.el) this.el = doc.createElement('div');
    return this.el;
  }
}
