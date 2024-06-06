import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        alert('Login successful');
        // this.router.navigate(['/dashboard']); // Redirige a la página deseada
      },
      error => {
        alert(error.error.message);
        // console.error('Login failed', error);
        // Manejar el error, mostrar mensaje al usuario, etc.
      }
    );
  }
}
