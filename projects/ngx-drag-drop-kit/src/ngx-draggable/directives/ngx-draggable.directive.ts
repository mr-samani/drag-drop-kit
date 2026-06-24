import {
  Directive,
  DOCUMENT,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  RendererStyleFlags2,
} from '@angular/core';
import { DragRef } from '../drag-ref';
import { IPosition } from '../contracts/IPosition';
import { fromEvent, Subscription } from 'rxjs';
import { OnInit } from '@angular/core';
import { getPointerOnViewPort } from '../utils/get-position';
import { NGX_DROPLIST } from './ngx-drop-list.directive';
import { DragDropService } from '../services/drag-drop.service';
import { NGX_DROPLIST_GROUP } from './ngx-drop-list-group.directive';

export const NGX_DRAGGABLE = new InjectionToken<DragRef>('ngx-draggable');

@Directive({
  selector: '[NgxDraggable]',
  providers: [
    {
      provide: NGX_DRAGGABLE,
      useExisting: NgxDraggable,
    },
  ],
  host: {
    '[style.touch-action]': '"none"', // CRITICAL: Always disable touch actions
  },
})
export class NgxDraggable<T = any> implements OnInit, OnDestroy {
  @Input() set boundary(value: HTMLElement | undefined) {
    this._ref.boundary = value;
  }
  get boundary(): HTMLElement | undefined {
    return this.boundary;
  }

  @Input() dragRootElement = '';

  @Input() disabled = false;
  @Output() dragStart = new EventEmitter<IPosition>();
  @Output() dragMove = new EventEmitter<IPosition>();
  @Output() dragEnd = new EventEmitter<IPosition>();

  @Input('data') set setData(val: T) {
    this._ref.data = val;
  }

  private previousTransitionProprety?: string;
  set dragging(val: boolean) {
    this._ref.isDragging = val == true;

    if (this._ref.isDragging) {
      this.previousTransitionProprety = this._ref.el.style.transitionProperty;
      this.renderer.setStyle(this._ref.el, 'transition-property', 'none', RendererStyleFlags2.Important);
      this.renderer.setStyle(this._ref.el, 'user-select', 'none');
      this.renderer.setStyle(this._ref.el, 'pointer-events', 'none');
      this.renderer.setStyle(this._ref.el, 'cursor', 'grabbing');
      this.renderer.setStyle(this._ref.el, 'z-index', '999999');
      this.renderer.setStyle(this._ref.el, 'touch-action', 'none');
      this.renderer.setStyle(this._ref.el, '-webkit-user-drag', 'none');
      this.renderer.setStyle(this._ref.el, '-webkit-tap-highlight-color', 'transparent');
      this.renderer.setStyle(this._ref.el, 'will-change', 'transform');
      this._ref.el.classList.add('dragging');
    } else {
      if (this.previousTransitionProprety)
        this.renderer.setStyle(this._ref.el, 'transition-property', this.previousTransitionProprety);
      else this.renderer.removeStyle(this._ref.el, 'transition-property');
      this.renderer.removeStyle(this._ref.el, 'user-select');
      this.renderer.removeStyle(this._ref.el, 'pointer-events');
      this.renderer.removeStyle(this._ref.el, 'cursor');
      this.renderer.removeStyle(this._ref.el, 'z-index');
      this.renderer.removeStyle(this._ref.el, '-webkit-user-drag');
      this.renderer.removeStyle(this._ref.el, '-webkit-tap-highlight-color');
      this.renderer.removeStyle(this._ref.el, 'will-change');

      this._ref.el.classList.remove('dragging');
    }
  }
  get dragging() {
    return this._ref.isDragging;
  }

  private pointerDown = false;
  private startSubscriptions: Subscription[] = [];
  private subscriptions: Subscription[] = [];

  private readonly renderer = inject(Renderer2);
  private _ref = new DragRef();
  private readonly doc = inject(DOCUMENT);

  private dropListContainer = inject(NGX_DROPLIST, { skipSelf: true, optional: true });
  private dropListGroup = inject(NGX_DROPLIST_GROUP, { skipSelf: true, optional: true });
  private dragDropService = inject(DragDropService);

  constructor(private elRef: ElementRef<HTMLElement>) {
    this._ref.dropListGroup = this.dropListGroup;
  }

  ngOnInit(): void {
    this._ref.el = this.dragRootElement
      ? (this.elRef.nativeElement.closest(this.dragRootElement) ?? this.elRef.nativeElement)
      : this.elRef.nativeElement;

    this.initDragHandler();
    // this.isFullRow = isFullRowElement(this._ref.el);
    this._ref.init();
    this.dragDropService.registerDragItem(this._ref);
    this._ref.withDropList(this.dropListContainer?._ref ?? null);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.startSubscriptions.forEach(sub => sub.unsubscribe());
    // this.autoScroll.stop();
    this.dragDropService.removeDragItem(this._ref);
    this._ref.dropList?.removeItem?.(this._ref);
  }

  initDragHandler() {
    // if passive = true => browser won't allow preventDefault
    this.startSubscriptions = [
      fromEvent<PointerEvent>(this._ref.el, 'pointerdown', { passive: false }).subscribe(ev => this.onPointerDown(ev)),
    ];
  }

  onEndDrag(_ev: PointerEvent) {
    if (this.dragging) {
      //  this.dragService.stopDrag(this);
      this.dragEnd.emit({ x: this._ref.x, y: this._ref.y });
    }
    this.dragging = false;
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.pointerDown = false;
    this._ref.endDrag();
  }

  onPointerDown(ev: PointerEvent) {
    if (ev.button !== 0 || this.disabled) return;
    // if (this.interaction.isResizing()) return;
    ev.preventDefault();
    // stopPropagation required for nested tree elements
    ev.stopPropagation();

    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [
      fromEvent<PointerEvent>(this.doc, 'pointermove', { passive: false }).subscribe(ev => this.onPointerMove(ev)),
      fromEvent<PointerEvent>(window, 'pointerup', { passive: false }).subscribe(ev => this.onEndDrag(ev)),
      fromEvent<PointerEvent>(window, 'pointercancel', { passive: false }).subscribe(ev => this.onEndDrag(ev)),
    ];

    this.pointerDown = true;
    const p = getPointerOnViewPort(ev);
    this._ref.pointerDown(p);
  }

  onPointerMove(ev: PointerEvent) {
    if (this.pointerDown && this._ref.isDragging == false) {
      const p = getPointerOnViewPort(ev);
      this._ref.startDrag(p);
      this.dragStart.emit(p);
      this.dragging = true;
    }

    let p = getPointerOnViewPort(ev);
    this._ref.dragMove(p);
    // this.dragService.getPointerElement(p);
    this.dragMove.emit({ x: this._ref.x, y: this._ref.y });
  }
}
