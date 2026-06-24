import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'drag', pathMatch: 'full' },
  { path: 'drag', loadComponent: () => import('./drag-demo/drag-demo').then(c => c.DragDemo) },
];
