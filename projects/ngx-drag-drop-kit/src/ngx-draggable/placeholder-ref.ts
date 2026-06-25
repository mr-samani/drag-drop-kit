import { TemplateRef } from '@angular/core';
import { DropListRef } from './drop-list-ref';
import { DragRef } from './drag-ref';

export class PlaceHolderRef {
  tpl?: TemplateRef<any>;
  dropList?: DropListRef | null;
  el?: HTMLElement;

  getElement(dragItem: DragRef): HTMLElement {
    if (this.el) return this.el;
    if (this.tpl) {
      const ctx = { width: dragItem.domRect.width, height: dragItem.domRect.height };
      const placeholderViewRef = this.tpl.createEmbeddedView(ctx);
      placeholderViewRef.detectChanges();
      // this.appRef.attachView(placeholderViewRef);
      this.el = placeholderViewRef.rootNodes[0] as HTMLElement;
    } else {
      this.el = dragItem.el.cloneNode(false) as HTMLElement;
      this.el.classList.add('ngx-drag-placeholder');
      this.el.style.background = '#3fccff69';
      this.el.style.border = '1px dashed #000';
      this.el.style.zIndex = '9999 !important';
      this.el.style.pointerEvents = 'none !important';
      if (this.isFlexibleAndWrap(dragItem.el)) {
      }
    }
    return this.el;
  }

  remove() {
    this.el?.remove();
    this.el = undefined;
  }

  private isFlexibleAndWrap(el: HTMLElement) {
    const styles = window.getComputedStyle(el);
    return styles.display == 'flex' && styles.flexWrap == 'wrap';
  }
}
