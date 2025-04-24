import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../auth.service';
import { CategoryService } from '../../category.service';
import { StatusService } from '../../status.service';
import { TaskStatus } from '../task.model';

@Component({
  standalone: true,
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule, RouterLink, MatSnackBarModule],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  allTasks: Task[] = [];
  filter: 'all' | 'completed' | 'pending' = 'all';
  statusOptions: any[] = [];
  categoryOptions: any[] = [];
  selectedStatuses: string[] = [];
  selectedCategories: string[] = [];

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private categoryService: CategoryService,
    private statusService: StatusService
  ) {
  }

  ngOnInit(): void {
    this.loadTasks();
    this.categoryService.getCategories().subscribe(categories => {
      this.categoryOptions = categories;
      this.selectedCategories = categories.map(c => c.name);
    });

    this.statusService.getStatuses().subscribe(statuses => {
      this.statusOptions = statuses;
      this.selectedStatuses = statuses.map(s => s.name);
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.allTasks = data;
        this.tasks = data; // по умолчанию
      },
      error: (err) => console.error('Error loading tasks', err)
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.snackBar.open('Task deleted successfully!', 'Close', {duration: 3000});
          this.loadTasks();
        },
        error: (err) => {
          console.error('Error deleting task', err);
          this.snackBar.open('Failed to delete task', 'Close', {duration: 3000});
        }
      });
    }
  }

  setFilter(filter: 'all' | 'completed' | 'pending'): void {
    this.filter = filter;
  }

  get filteredTasks(): Task[] {
    return this.tasks.filter(task =>
      this.selectedStatuses.includes(task.status?.name) &&
      this.selectedCategories.includes(task.category?.name)
    );
  }

  toggleStatusFilter(status: any): void {
    const name = status.name || status;
    const idx = this.selectedStatuses.indexOf(name);
    if (idx > -1) this.selectedStatuses.splice(idx, 1);
    else this.selectedStatuses.push(name);
  }

  toggleCategoryFilter(category: any): void {
    const name = category.name || category;
    const idx = this.selectedCategories.indexOf(name);
    if (idx > -1) this.selectedCategories.splice(idx, 1);
    else this.selectedCategories.push(name);
  }

  get progress(): number {
    const total = this.allTasks.length;
    const completed = this.allTasks.filter(t => t.status?.name === 'Completed').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
  
  changeTaskStatus(task: Task): void {
    const currentStatus = task.status;
    const statuses: TaskStatus[] = this.statusOptions; 
  
    const currentIndex = statuses.findIndex(status => status.name === currentStatus?.name);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]; 
  
    task.status = nextStatus; 
  
    this.updateTaskStatus(task);
  }
  
  updateTaskStatus(task: Task): void {
    const updatedTaskData = {
      ...task,
      status_id: task.status.id
    };
  
    this.taskService.updateTask(task.id, updatedTaskData).subscribe({
      next: () => {
        this.snackBar.open(`Task status updated to ${task.status?.name}!`, 'Close', { duration: 3000 });
        this.loadTasks(); 
      },
    });
  }
  
  
}
