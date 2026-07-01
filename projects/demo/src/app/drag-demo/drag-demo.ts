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
  todo     = ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'];
  progress = ['Task F', 'Task G'];
  done     = ['Task H'];

  hItems   = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];
  rtlItems = ['یک', 'دو', 'سه', 'چهار', 'پنج', 'شش'];
  gridItems = ['🍎', '🍊', '🍋', '🍇', '🍓', '🫐', '🍒', '🥭', '🍍'];

  drop(event: IDropEvent) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
