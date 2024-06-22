import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; 

  user = new BehaviorSubject<{ email: string; role: string; id: number; telefono: string }>({ email: '', role: '' , id: 0, telefono: ''});

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const email = localStorage.getItem('email') || '';
      const role = localStorage.getItem('role') || '';
      const id = parseInt(localStorage.getItem('id') || '0', 10);
      const telefono = localStorage.getItem('telefono') || '';
      this.user.next({ email, role , id, telefono});
    }
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/usuarios/login`;
    return this.http.post(url, { email, password});
  }

  register(email: string, password: string, telefono: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/register`, { email, password, telefono });
  }

  updateUser(email: string, role: string, id: number, telefono: string) {
    this.user.next({email, role, id, telefono});
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    localStorage.setItem('id', id.toString());
    localStorage.setItem('telefono', telefono);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('telefono');
    this.user.next({email: '', role: '', id: 0, telefono: ''});
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

  getId(): number {
    return parseInt(localStorage.getItem('id') || '0', 10);
  }

  getTelefono(): string | null {
    return localStorage.getItem('telefono');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  editarPerfil(email: string, telefono: string, id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/update`, { email, telefono, id });
  }

  cambiarContra(oldPassword: string, newPassword: string, id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/change-password`, { oldPassword, newPassword, id });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/reset-password`, { token, newPassword });
  }
}
