import { Component } from '@angular/core';

import { Producto } from './models/producto';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  email: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.email = this.authService.getEmail();
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
