import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData = {
    username: '',
    email: '',
    password: '',
  };

  constructor(private api: ApiService, private router: Router) {}

  register() {
    this.api.register(this.formData).subscribe({
      next: () => {
        alert('Registration successful!');
        this.router.navigate(['/login']); 
      },
      error: err => {
        alert('Registration failed: ' + JSON.stringify(err.error));
      }
    });
  }
}
