import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.scss'
})
export class EditarPerfilComponent {

  email: string = '';
  role: string = '';
  telefono: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmarContra: string = '';
  actualizacionExitosa: boolean = false;
  actualizacionFallida: boolean = false;
  contraCambiada: boolean = false;
  contraNoCambiada: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.email = user.email;
      this.role = user.role;
      this.telefono = user.telefono;
    });
  }

  actualizarInfo() {
    this.actualizacionExitosa = false;
    this.actualizacionFallida = false;
    if (this.email && this.telefono) {
      this.authService.editarPerfil(this.email, this.telefono, this.authService.user.value.id).subscribe(
        response => {
          this.authService.updateUser(this.email, this.role, this.authService.user.value.id, this.telefono);
          this.actualizacionExitosa = true;
        },
        error => {
          this.actualizacionFallida = true;
          alert(error.error.message);
        }
      );
    }
    else {
      this.actualizacionFallida = true;
      alert('Por favor, rellene todos los campos');
    }
  }

  acualizarContra() {
    this.contraCambiada = false;
    this.contraNoCambiada = false;
    if (this.oldPassword && this.newPassword && this.confirmarContra) {
      if (this.newPassword === this.confirmarContra) {
        this.authService.cambiarContra(this.oldPassword, this.newPassword, this.authService.user.value.id).subscribe(
          response => {
            this.contraCambiada = true;
            this.oldPassword = '';
            this.newPassword = '';
            this.confirmarContra = '';
          },
          error => {
            this.contraNoCambiada = true;
            alert(error.error.message);
          }
        );
      }
      else {
        this.contraNoCambiada = true;
        alert('Las contraseñas no coinciden');
      }
    }
    else {
      this.contraNoCambiada = true;
      alert('Por favor, rellene todos los campos');
    }
  }
}
