import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionId: string;

  constructor(private apiService: ApiService, private http: HttpClient) {
    this.sessionId = localStorage.getItem('sessionId') || this.generateSessionId();
  }

  private generateSessionId(): string { // Si no tinc sessionId en localStorage, creo un random
    const newSessionId = 'session-' + Math.random().toString(36).substring(2); 
    localStorage.setItem('sessionId', newSessionId); // guardo en localStorage
    return newSessionId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // Registro visit en la db
  recordVisit(): Observable<any> {
    const sessionId = this.getSessionId();
    const user = this.apiService.getLoggedInUser();

    const statData = {
      sessionId: sessionId,
      userId: user ? user._id : null,  // Si no usuari, null
      llocEvent: 'home',  // event tipus home
      tipusEvent: 'visita',  // event tipus visita
    };
    
    return this.http.post('http://localhost:3000/Stats/create', statData);
  }
}
