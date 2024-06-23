import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  resetError: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const token = this.route.snapshot.queryParams['token'];
      if (!token) {
        this.resetError = 'Token inválido. Intenta nuevamente desde el correo electrónico.';
        return;
      }

      const newPassword = this.resetForm.value.password;

      this.authService.resetPassword(token, newPassword).subscribe(
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
}
