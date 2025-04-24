import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterData } from './models';
@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  login(data: { username: string; password: string; }): Observable<{ access: string; refresh: string; }> {
    return this.http.post<{ access: string; refresh: string; }>(`${this.baseUrl}/api/users/login/`, data);
  }

  refreshToken(refresh: string): Observable<{ access: string; }> {
    return this.http.post<{ access: string; }>(`${this.baseUrl}/api/token/refresh/`, { refresh });
  }

  logout(refresh: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/users/logout/`, { refresh_token: refresh });
  }

  getCurrentUser(): Observable<{ email: string; username: string; }> {
    return this.http.get<{ email: string; username: string; }>(`${this.baseUrl}/api/current_user/`);
  }
  
  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/users/register/`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
