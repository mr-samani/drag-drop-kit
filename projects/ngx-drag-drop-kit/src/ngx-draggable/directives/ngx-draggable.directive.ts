import {
  Directive,
  DOCUMENT,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  RendererStyleFlags2,
} from '@angular/core';
import { DragRef } from '../drag-ref';
import { NGX_DRAGGABLE } from '../tokens/draggable.token';
import { IPosition } from '../contracts/iposition';
import { fromEvent, Subscription } from 'rxjs';
import { OnInit } from '@angular/core';
import { checkBoundX, checkBoundY } from '../utils/check-boundary';
import { getPointerPositionOnViewPort, getPointerPosition } from '../utils/get-position';
import { getXYfromTransform } from '../utils/get-transform';
import { ElementHelper } from '../utils/element.helper';
import { NGX_DROPLIST } from '../tokens/drop-list.token';
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
export class NgxDraggable<T = any> extends DragRef<T> implements OnInit, OnDestroy {
  private _boundary?: HTMLElement;
  private boundaryDomRect?: DOMRect;
  @Input() set boundary(value: HTMLElement | undefined) {
    this._boundary = value;
    this.updateDomRect();
  }
  get boundary(): HTMLElement | undefined {
    return this._boundary;
  }

  @Input() dragRootElement = '';

  @Input() disabled = false;
  @Output() dragStart = new EventEmitter<IPosition>();
  @Output() dragMove = new EventEmitter<IPosition>();
  @Output() dragEnd = new EventEmitter<IPosition>();

  @Input('data') set setData(d: T) {
    this.data = d;
  }

  private previousTransitionProprety?: string;
  set dragging(val: boolean) {
    this.isDragging = val == true;
    if (this.isDragging) {
      this.previousTransitionProprety = this.el.style.transitionProperty;
      this.renderer.setStyle(this.el, 'transition-property', 'none', RendererStyleFlags2.Important);
      this.renderer.setStyle(this.el, 'user-select', 'none');
      this.renderer.setStyle(this.el, 'pointer-events', 'none');
      this.renderer.setStyle(this.el, 'cursor', 'grabbing');
      this.renderer.setStyle(this.el, 'z-index', '999999');
      this.renderer.setStyle(this.el, 'touch-action', 'none');
      this.renderer.setStyle(this.el, '-webkit-user-drag', 'none');
      this.renderer.setStyle(this.el, '-webkit-tap-highlight-color', 'transparent');
      this.renderer.setStyle(this.el, 'will-change', 'transform');
      this.el.classList.add('dragging');
    } else {
      if (this.previousTransitionProprety)
        this.renderer.setStyle(this.el, 'transition-property', this.previousTransitionProprety);
      else this.renderer.removeStyle(this.el, 'transition-property');
      this.renderer.removeStyle(this.el, 'user-select');
      this.renderer.removeStyle(this.el, 'pointer-events');
      this.renderer.removeStyle(this.el, 'cursor');
      this.renderer.removeStyle(this.el, 'z-index');
      this.renderer.removeStyle(this.el, '-webkit-user-drag');
      this.renderer.removeStyle(this.el, '-webkit-tap-highlight-color');
      this.renderer.removeStyle(this.el, 'will-change');

      this.el.classList.remove('dragging');
    }
  }
  get dragging() {
    return this.isDragging;
  }

  isTouched = false;
  protected x: number = 0;
  protected y: number = 0;
  private previousXY: IPosition = { x: 0, y: 0 };
  private isFixedPosition = false;
  private startSubscriptions: Subscription[] = [];
  private subscriptions: Subscription[] = [];

  private readonly renderer = inject(Renderer2);
  private readonly doc = inject(DOCUMENT);
  constructor(elRef: ElementRef) {
    super();
    this.el = elRef.nativeElement;
  }

  ngOnInit(): void {
    this.initDragHandler();
    this.findDragRootElement();
    // this.isFullRow = isFullRowElement(this.el);
    this.init();

    console.log(this.dropListContainer);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.startSubscriptions.forEach(sub => sub.unsubscribe());
    // this.autoScroll.stop();
    // this.dragRegister.removeDragItem(this);
    this.el.classList.remove('ngx-draggable');
  }
  findDragRootElement() {
    if (this.dragRootElement) {
      let parentRoot: HTMLElement | null = ElementHelper.findParentBySelector(this.el, this.dragRootElement);
      if (parentRoot) {
        this.el = parentRoot;
      }
    }
    this.el.classList.add('ngx-draggable');
    // this.dragRegister.registerDragItem(this);
  }
  init() {
    const xy = getXYfromTransform(this.el);
    this.x = xy.x;
    this.y = xy.y;
    this.updateDomRect();
  }
  updateDomRect() {
    this._domRect = this.el.getBoundingClientRect();
    if (this._boundary) {
      this.boundaryDomRect = this._boundary.getBoundingClientRect();
    }
  }
  initDragHandler() {
    // if passive = true => browser won't allow preventDefault
    this.startSubscriptions = [
      fromEvent<PointerEvent>(this.el, 'pointerdown', { passive: false }).subscribe(ev => this.onPointerDown(ev)),
    ];
  }

  onEndDrag(ev: PointerEvent) {
    if (this.dragging) {
      //  this.dragService.stopDrag(this);
      this.dragEnd.emit({ x: this.x, y: this.y });
    }
    this.dragging = false;
    this.isTouched = false;
    // this.autoScroll.stop();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onPointerDown(ev: PointerEvent) {
    if (ev.button !== 0 || this.disabled) return;
    // if (this.interaction.isResizing()) return;
    ev.preventDefault();
    // stopPropagation required for nested tree elements
    ev.stopPropagation();
    const styles = getComputedStyle(this.el);
    this.isFixedPosition = styles.position === 'fixed';

    // اگر fixed است از viewport position استفاده کن
    this.previousXY = this.isFixedPosition ? getPointerPositionOnViewPort(ev) : getPointerPosition(ev);

    this.isTouched = true;
    this.init();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [
      fromEvent<PointerEvent>(this.doc, 'pointermove', { passive: false }).subscribe(ev => this.onPointerMove(ev)),
      fromEvent<PointerEvent>(window, 'pointerup', { passive: false }).subscribe(ev => this.onEndDrag(ev)),
      fromEvent<PointerEvent>(window, 'pointercancel', { passive: false }).subscribe(ev => this.onEndDrag(ev)),
    ];
  }

  onPointerMove(ev: PointerEvent) {
    let p = getPointerPositionOnViewPort(ev);
    // this.dragService.getPointerElement(p);

    let position = getPointerPosition(ev);

    if (this.isFixedPosition) {
      position = getPointerPositionOnViewPort(ev);
    }

    const offsetX = position.x - this.previousXY.x;
    const offsetY = position.y - this.previousXY.y;

    //fixed for lag to start dragging
    if (Math.abs(offsetY) < 1 && Math.abs(offsetX) < 1) {
      return;
    }

    if (this.isTouched && !this.dragging) {
      this.dragging = true;
      //  this.dragService.startDrag(this);
      this.dragStart.emit(this.previousXY);
      // this.autoScroll.handleAutoScroll(ev);
    }
    if (!this.dragging) {
      return;
    }

    //if (this.dropList) {
    //  this.dragService.dragMove(this, ev, offsetX, offsetY);
    //} else {
    this.updatePosition(offsetX, offsetY);
    //}
    this.dragMove.emit({ x: this.x, y: this.y });
  }

  updatePosition(offsetX: number, offsetY: number) {
    const selfRect = this.el.getBoundingClientRect();

    const clampedOffsetX = checkBoundX(selfRect, this.boundaryDomRect, offsetX);
    this.x += clampedOffsetX;

    const clampedOffsetY = checkBoundY(selfRect, this.boundaryDomRect, offsetY);
    this.y += clampedOffsetY;

    this.previousXY = {
      x: clampedOffsetX + this.previousXY.x,
      y: clampedOffsetY + this.previousXY.y,
    };

    let transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    this.renderer.setStyle(this.el, 'transform', transform);
    return transform;
  }
}
