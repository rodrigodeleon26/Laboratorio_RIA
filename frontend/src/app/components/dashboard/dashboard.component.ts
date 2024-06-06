import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
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
