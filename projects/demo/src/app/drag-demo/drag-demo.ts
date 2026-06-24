import { Component } from '@angular/core';
import { NgxDraggableDirective } from 'ngx-drag-drop-kit';
@Component({
  selector: 'app-drag-demo',
  imports: [NgxDraggableDirective],
  templateUrl: './drag-demo.html',
  styleUrl: './drag-demo.scss',
})
export class DragDemo {}
