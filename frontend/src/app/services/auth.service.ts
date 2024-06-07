import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; 

  user = new BehaviorSubject<{ email: string; role: string }>({ email: '', role: '' });

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/usuarios/login`;
    return this.http.post(url, { email, password });
  }

  register(email: string, password: string, telefono: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/register`, { email, password, telefono });
  }

  updateUser(email: string, role: string) {
    this.user.next({email, role});
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }
}
