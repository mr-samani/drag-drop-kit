import { Directive, ElementRef, inject, Input, input, OnDestroy, OnInit } from '@angular/core';
import { DropListRef } from '../drop-list-ref';
import { NGX_DROPLIST } from '../tokens/drop-list.token';

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
