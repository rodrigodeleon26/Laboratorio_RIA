import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/usuarios/login`;
    return this.http.post(url, { email, password });
  }

  register(email: string, password: string, telefono: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/register`, { email, password, telefono });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }
}
