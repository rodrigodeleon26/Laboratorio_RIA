import { Component } from '@angular/core';

import { Producto } from './models/producto';
import { AuthService } from './services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  email: string | null = '';
  role: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.email = user.email;
      this.role = user.role;
    });
  }

  setUser(email: string, role: any) {
    this.email = email;
    this.role = role;
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
