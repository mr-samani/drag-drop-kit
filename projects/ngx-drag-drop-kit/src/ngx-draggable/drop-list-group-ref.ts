export class DropListGroupRef<T = any> {
  el!: HTMLElement;
  /** Drop lists registered inside the group. */
  readonly _items = new Set<T>();
}
