// frontend\src\app\services\user\user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:3000';
  public user = new BehaviorSubject<{ email: string; role: string; id: number; telefono: string } | null>(null);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadUser();
  }

  private loadUser() {
    if (typeof window !== 'undefined' && window.localStorage) { // Asegura que window y localStorage existan
      if (this.authService.isAuthenticated()) { // Verifica si el usuario está autenticado
        this.getUserInfo().subscribe(userInfo => {
          this.user.next(userInfo);
        });
      } else {
        this.user.next(null); // Reinicia el usuario a null si no está autenticado
      }
    }
  }

  private getUserInfo(): Observable<{ email: string; role: string; id: number; telefono: string }> {
    return this.http.get<{ email: string; role: string; id: number; telefono: string }>(`${this.apiUrl}/usuarios/getInfo`);
  }

  updateUser(email: string, role: string, id: number, telefono: string) {
    this.user.next({ email, role, id, telefono });
  }

  getEmail(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/usuarios/getEmail`);
  }

  getRole(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/usuarios/getRole`);
  }

  getId(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/usuarios/getId`);
  }

  getTelefono(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/usuarios/getTelefono`);
  }
}
