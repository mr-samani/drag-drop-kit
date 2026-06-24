import { AfterViewInit, Directive, ElementRef, inject, InjectionToken, OnInit } from '@angular/core';
import { DropListGroupRef } from '../drop-list-group-ref';
import { DragRegister } from '../drad-drop';

export const NGX_DROPLIST_GROUP = new InjectionToken<DropListGroupRef>('ngx-drop-list-group');

@Directive({
  selector: '[NgxDropListGroup]',
  providers: [{ provide: NGX_DROPLIST_GROUP, useExisting: NgxDropListGroup }],
})
export class NgxDropListGroup extends DropListGroupRef implements AfterViewInit {
  private readonly dragRegister = inject(DragRegister);
  constructor(elRef: ElementRef) {
    super();
    this.el = elRef.nativeElement;
  }

  ngAfterViewInit(): void {
    console.log(this.dragRegister.dragItemMap);
  }
}
