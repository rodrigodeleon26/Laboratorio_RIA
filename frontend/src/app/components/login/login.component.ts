import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(loginForm: any): void {
    if (loginForm.valid) {
      this.authService.login(this.email, this.password).subscribe(
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
