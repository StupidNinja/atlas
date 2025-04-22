import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet],
  standalone: true
})
export class AppComponent {
  title = 'todolist_front';

  constructor(private auth: AuthService) {

  }
}
