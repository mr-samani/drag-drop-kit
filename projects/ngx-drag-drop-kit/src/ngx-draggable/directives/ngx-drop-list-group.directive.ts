import { AfterViewInit, Directive, ElementRef, InjectionToken, OnDestroy } from '@angular/core';
import { DropListGroupRef } from '../drop-list-group-ref';

export const NGX_DROPLIST_GROUP = new InjectionToken<DropListGroupRef>('ngx-drop-list-group');

@Directive({
  selector: '[NgxDropListGroup]',
  providers: [{ provide: NGX_DROPLIST_GROUP, useExisting: NgxDropListGroup }],
})
export class NgxDropListGroup implements AfterViewInit, OnDestroy {
  _ref = new DropListGroupRef();
  constructor(elRef: ElementRef) {
    this._ref.el = elRef.nativeElement;
  }

  ngAfterViewInit(): void {}
  ngOnDestroy(): void {
    this._ref.clear();
  }
}
