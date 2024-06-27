import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  }

  getToken(): string | null {
    return localStorage.getItem('token');
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

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }
}
