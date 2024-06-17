import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AppComponent } from '../../app.component';

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
          localStorage.setItem('role', response.role);
          // Actualiza el BehaviorSubject con el nuevo email y rol del usuario
          this.authService.updateUser(this.email, response.role);
          this.router.navigate(['/home']);
        },
        error => {
          alert(error.error.message);
        }
      );
    }
  }
}
