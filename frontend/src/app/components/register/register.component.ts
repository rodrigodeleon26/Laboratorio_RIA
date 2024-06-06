import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  telefono: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(registerForm: any): void {
    if (registerForm.valid) {
      this.authService.register(this.email, this.password, this.telefono).subscribe(
        response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', this.email);
          this.router.navigate(['/dashboard']);
        },
        error => {
          alert(error.error.message);
        }
      );
    } 
  }
}
