import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  password: string = '';
  resetError: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  resetPassword() {
    const token = this.route.snapshot.queryParams['token']; // Cambio aplicado aquí
    if (!token) {
      this.resetError = 'Token inválido. Intenta nuevamente desde el correo electrónico.';
      return;
    }
  
    this.authService.resetPassword(token, this.password).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      error => {
        // Asegúrate de manejar el error aquí
        this.resetError = 'Error al restablecer la contraseña. Por favor, intenta de nuevo.';
      }
    );
  }
}
