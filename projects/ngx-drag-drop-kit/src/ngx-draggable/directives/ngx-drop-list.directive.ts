import { Directive, ElementRef, inject, InjectionToken, Input, input, OnDestroy, OnInit } from '@angular/core';
import { DropListRef } from '../drop-list-ref';

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
export class NgxDropList<T = any[]> extends DropListRef<T> implements OnInit, OnDestroy {
  @Input('data') set setData(d: T) {
    this.data = d;
  }
  constructor(elRef: ElementRef) {
    super();
    this.el = elRef.nativeElement;
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
