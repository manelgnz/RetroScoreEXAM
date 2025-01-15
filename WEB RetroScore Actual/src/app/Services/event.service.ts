import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:3000/api/events'; // URL del backend para obtener eventos

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getFilteredEvents(filter: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?filter=${filter}`);
  }
}
