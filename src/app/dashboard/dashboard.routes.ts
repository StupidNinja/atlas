import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', component: TaskListComponent },
      { path: 'create', component: TaskFormComponent },
      { path: 'edit/:id', component: TaskFormComponent }
    ]
  }
];
