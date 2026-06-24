import { Directive, ElementRef, inject, InjectionToken, Input, input, OnDestroy, OnInit } from '@angular/core';
import { DropListRef } from '../drop-list-ref';
import { DragRegister } from '../drad-drop';

export const NGX_DROPLIST = new InjectionToken<DropListRef>('ngx-drop-list');

@Directive({
  selector: '[NgxDropList]',
  providers: [
    {
      provide: NGX_DROPLIST,
      useExisting: NgxDropList,
    },
  ],
})
export class NgxDropList<T = any> implements OnInit, OnDestroy {
  _ref = new DropListRef();
  @Input('data') set setData(val: T) {
    this._ref.data = val;
  }

  private readonly dragRegister = inject(DragRegister);

  constructor(elRef: ElementRef) {
    this._ref.el = elRef.nativeElement;
  }
  ngOnInit(): void {
    this.dragRegister.registerDropList(this._ref);
  }
  ngOnDestroy(): void {
    this.dragRegister.removeDropList(this._ref);
  }
}
