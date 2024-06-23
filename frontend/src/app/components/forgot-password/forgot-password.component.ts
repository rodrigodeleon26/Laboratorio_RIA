// forgot-password.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup;
  message: string = '';
  errorMessage: string = '';
  alertMessage: string = ''; // Mensaje para el alert
  alertType: 'success' | 'danger' = 'success'; // Tipo de alerta: éxito o error
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true; // Activar el spinner
      
      const email = this.forgotPasswordForm.value.email;
      this.authService.forgotPassword(email).subscribe(
        (response) => {
          this.alertMessage = response.message; // Mensaje de éxito
          this.alertType = 'success';
          this.setAutoCloseAlert(3000); // Cerrar el mensaje automáticamente después de 5 segundos
        },
        (error) => {
          this.alertMessage = error.error.message; // Mensaje de error
          this.alertType = 'danger';
          this.setAutoCloseAlert(3000); // Cerrar el mensaje automáticamente después de 5 segundos
        }
      ).add(() => {
        this.loading = false; // Desactivar el spinner
      });
    }
  }

  setAutoCloseAlert(timeout: number) {
    setTimeout(() => {
      this.alertMessage = '';
    }, timeout);
  }
}
