import { Directive, ElementRef, inject, InjectionToken, Input, OnDestroy, OnInit } from '@angular/core';
import { DropListRef } from '../drop-list-ref';
import { NGX_DROPLIST_GROUP } from './ngx-drop-list-group.directive';

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
  private dropListGroup = inject(NGX_DROPLIST_GROUP, { skipSelf: true, optional: true });

  constructor(elRef: ElementRef) {
    this._ref.el = elRef.nativeElement;
    this._ref.dropListGroup = this.dropListGroup;
  }
  ngOnInit(): void {
    this.dropListGroup?.registerDropList?.(this._ref);
  }
  ngOnDestroy(): void {
    this.dropListGroup?.removeDropList?.(this._ref);
  }
}
