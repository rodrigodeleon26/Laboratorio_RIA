import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  alertMessage: string = ''; // Mensaje para el alert
  alertType: 'success' | 'danger' = 'success'; // Tipo de alerta: éxito o error

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', [Validators.required, Validators.pattern('\\d{8,9}')]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, password, telefono } = this.registerForm.value;
      this.authService.register(email, password, telefono).subscribe(
        response => {
          this.router.navigate(['/login']);
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
