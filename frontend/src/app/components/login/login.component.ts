import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  alertMessage: string = ''; // Mensaje para el alert
  alertType: 'success' | 'danger' = 'success'; // Tipo de alerta: éxito o error

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', email);
          localStorage.setItem('role', response.role);
          localStorage.setItem('id', response.id);
          // Actualiza el BehaviorSubject con el nuevo email y rol del usuario
          this.authService.updateUser(email, response.role, response.id, response.telefono);
          this.router.navigate(['/home']);
        },
        error => {
          this.alertMessage = error.error.message;
          this.alertType = 'danger';
          this.setAutoCloseAlert(3000);
        }
      );
    }
  }

  setAutoCloseAlert(timeout: number) {
    setTimeout(() => {
      this.alertMessage = '';
    }, timeout);
  }
}
