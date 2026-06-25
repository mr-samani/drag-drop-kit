import { Component, signal } from '@angular/core';
import {
  IDropEvent,
  moveItemInArray,
  NgxDraggable,
  NgxDropList,
  NgxDropListGroup,
  NgxPlaceholder,
  transferArrayItem,
} from 'ngx-drag-drop-kit';
@Component({
  selector: 'app-drag-demo',
  imports: [NgxDraggable, NgxDropList, NgxDropListGroup, NgxPlaceholder],
  templateUrl: './drag-demo.html',
  styleUrl: './drag-demo.scss',
})
export class DragDemo {
  items = signal<string[]>(['a', 'b', 'c', 'd', 'e']);
  progress = signal<string[]>(['f']);
  done = signal<string[]>([]);

  drop(event: IDropEvent) {
    console.log('dropEvent', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
