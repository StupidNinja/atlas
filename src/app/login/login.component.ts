import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../auth.service';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => (this.error = 'Invalid credentials'),
    });
  }
}
