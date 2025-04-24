import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../category.service';
import { StatusService } from '../../status.service';
import { Location } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule]
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId!: number;

  statuses: any[] = [];
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private statusService: StatusService,
    private location: Location

  ) {}
  
  goBack(): void {
    this.location.back();
  }
  
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });

    this.statusService.getStatuses().subscribe(data => {
      this.statuses = data;
    });

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: [null, Validators.required],
      category: [null, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.taskId = +id;
        this.taskService.getTasks().subscribe(tasks => {
          const task = tasks.find(t => t.id === this.taskId);
          if (task) {
            this.taskForm.patchValue({
              ...task,
              status: task.status.id,
              category: task.category.id
            });
          }
        });
      }
    });
  }

  onSubmit(): void {
    console.log('Form submitted!', this.taskForm.value);
    if (this.taskForm.invalid) return;

    const taskData = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      status_id: parseInt(this.taskForm.value.status),
      category_id: parseInt(this.taskForm.value.category)
    };

    if (this.isEditMode) {
      this.taskService.updateTask(this.taskId, taskData).subscribe({
        next: () => this.router.navigate(['/dashboard/tasks']),
        error: (err) => console.error('Error updating task', err)
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.snackBar.open('Task created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/tasks']);
        },
        error: (err) => {
          console.error('Error creating task', err);
          this.snackBar.open('Error: ' + JSON.stringify(err.error), 'Close', { duration: 5000 });
        }
      });
    }
  }
}
