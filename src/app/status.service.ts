import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatusService {
  private apiUrl = 'http://localhost:8000/api/statuses/';  // убедись, что это правильный URL

  constructor(private http: HttpClient) {
  }

  getStatuses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
