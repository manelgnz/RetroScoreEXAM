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
  recordVisit(llocEvent: string): Observable<any> {
    const sessionId = this.getSessionId();
    const user = this.apiService.getLoggedInUser();

    const statData = {
      sessionId: sessionId,
      userId: user ? user._id : null,  // Si no usuari, null
      llocEvent: llocEvent,  // event tipus home
      tipusEvent: 'visita',  // event tipus visita
    };
    
    return this.http.post('http://localhost:3000/Stats/create', statData);
  }

  recordButtonClick(): Observable<any> {
    const sessionId = this.getSessionId();
    const user = this.apiService.getLoggedInUser();
  
    const statData = {
      sessionId: sessionId,
      userId: user ? user._id : null,  
      llocEvent: 'header',               
      tipusEvent: 'click',
    };
  
    return this.http.post('http://localhost:3000/Stats/create', statData);
  }

  recordCartButtonClick(): Observable<any> {
    const sessionId = this.getSessionId();
    const user = this.apiService.getLoggedInUser();

    const statData = {
      sessionId: sessionId,
      userId: user ? user._id : null,  // Si no hay usuario, se pone null
      llocEvent: 'cesta',  // Evento del clic en la cesta
      tipusEvent: 'click',
    };

    return this.http.post('http://localhost:3000/Stats/create', statData);
  }
}
