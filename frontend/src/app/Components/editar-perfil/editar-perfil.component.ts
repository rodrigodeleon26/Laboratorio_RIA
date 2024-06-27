import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UsuariosService } from '../../services/usuarios/usuarios.service';

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

  constructor(private usuarioService: UsuariosService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.usuarioService.user.subscribe(user => {
      if (user) { // Verifica si user no es null
        this.email = user.email;
        this.role = user.role;
        this.telefono = user.telefono;
      }
    });
  }

  actualizarInfo() {
    this.actualizacionExitosa = false;
    this.actualizacionFallida = false;
    if (this.email && this.telefono && this.usuarioService && this.usuarioService.user.value) {
      this.authService.editarPerfil(this.email, this.telefono, this.usuarioService.user.value.id).subscribe(
        response => {
          if (this.usuarioService && this.usuarioService.user.value) { // Verificar nuevamente por precaución
            this.usuarioService.updateUser(this.email, this.role, this.usuarioService.user.value.id, this.telefono);
            this.actualizacionExitosa = true;
          }
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
    if (this.oldPassword && this.newPassword && this.confirmarContra && this.usuarioService && this.usuarioService.user.value) {
        if (this.newPassword === this.confirmarContra) {
            this.authService.cambiarContra(this.oldPassword, this.newPassword, this.usuarioService.user.value.id).subscribe(
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
        } else {
            this.contraNoCambiada = true;
            alert('Las contraseñas no coinciden');
        }
    } else {
        this.contraNoCambiada = true;
        alert('Por favor, rellene todos los campos');
    }
}

  abrirCarrito(){
    this.router.navigate(['/ordenar']);
  }
}
