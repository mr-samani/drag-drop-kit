import { Component, signal } from '@angular/core';
import { NgxDraggable, NgxDropList, NgxDropListGroup } from 'ngx-drag-drop-kit';
@Component({
  selector: 'app-drag-demo',
  imports: [NgxDraggable, NgxDropList, NgxDropListGroup],
  templateUrl: './drag-demo.html',
  styleUrl: './drag-demo.scss',
})
export class DragDemo {
  items = signal<string[]>(['a', 'b', 'c', 'd', 'e']);
  progress = signal<string[]>(['f']);
  done = signal<string[]>([]);
}
