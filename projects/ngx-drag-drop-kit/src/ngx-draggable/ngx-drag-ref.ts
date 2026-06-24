export class NgxDragRef<T = any> {
  data?: T;
  _domRect?: DOMRect;
  el!: HTMLElement;
  isDragging: boolean = false;
}
