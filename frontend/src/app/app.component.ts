import { Component } from '@angular/core';

import { AuthService } from './services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from './services/usuarios/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  email: string | null = '';
  role: string | null = '';

  constructor(private authService: AuthService, private usuarioService: UsuariosService, private router: Router) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage)
    this.usuarioService.user.subscribe(user => {
      if (user){
        this.email = user.email;
        this.role = user.role;
      }
    });
  }

  setUser(email: string, role: any) {
    this.email = email;
    this.role = role;
  }

  logout(): void {
    this.authService.logout();
    this.usuarioService.updateUser('', '', 0, ''); // Limpiar datos del usuario
    this.router.navigate(['/home']);
  }
}
