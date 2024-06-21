import { Component, OnInit } from '@angular/core';
import { OrdenesService } from '../../services/ordenes/ordenes.service';
import { AuthService } from '../../services/auth/auth.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {
  ordenes: any[] = [];
  role = '';
  userId = 0;

  paginaActual: number = 1;
  OrdenesPorPagina: number = 6;
  totalPaginas: number = 0;

  ordenesPendientes: any[] = [];
  ordenesEnPreparacion: any[] = [];
  ordenesListasParaEntregar: any[] = [];

  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn = new BehaviorSubject<string>('nombre');

  constructor(private ordenesService: OrdenesService, private authService: AuthService) { }

  ngOnInit(): void {

    this.authService.user.subscribe(user => {
      this.role = user.role;
      this.userId = user.id;
    });

    if(this.role === 'USER'){
      this.ordenesService.getOrdenByUsuario(this.userId).subscribe(data => {
        this.ordenes = data;
      }, error => {
        console.error('Error fetching user orders', error);
      });
    }
    else {
      this.ordenesService.getOrdenes().subscribe(data => {
        this.ordenes = data;
      }, error => {
        console.error('Error fetching orders', error);
      });
    }

    this.ordenesPendientes = this.ordenes.filter(orden => orden.estado === 'PENDIENTE');
    this.ordenesEnPreparacion = this.ordenes.filter(orden => orden.estado === 'EN PREPARACION');
    this.ordenesListasParaEntregar = this.ordenes.filter(orden => orden.estado === 'LISTO PARA RECOGER');

    this.totalPaginas = Math.ceil(this.ordenesPendientes.length / this.OrdenesPorPagina);
  }

  getPaginadasPendiente(): any[] {
    const inicio = (this.paginaActual - 1) * this.OrdenesPorPagina;
    const fin = inicio + this.OrdenesPorPagina;
    return this.ordenesPendientes.slice(inicio, fin);
  }

  getPaginadasEnPreparacion(): any[] {
    const inicio = (this.paginaActual - 1) * this.OrdenesPorPagina;
    const fin = inicio + this.OrdenesPorPagina;
    return this.ordenesEnPreparacion.slice(inicio, fin);
  }

  getPaginadasListasParaEntregar(): any[] {
    const inicio = (this.paginaActual - 1) * this.OrdenesPorPagina;
    const fin = inicio + this.OrdenesPorPagina;
    return this.ordenesListasParaEntregar.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  actualizarCantPaginas(categoria: string): void {
    if(categoria === 'PENDIENTE'){
      this.totalPaginas = Math.ceil(this.ordenesPendientes.length / this.OrdenesPorPagina);
    }
    else if(categoria === 'EN PREPARACION'){
      this.totalPaginas = Math.ceil(this.ordenesEnPreparacion.length / this.OrdenesPorPagina);
    }
    else if(categoria === 'LISTO PARA RECOGER'){
      this.totalPaginas = Math.ceil(this.ordenesListasParaEntregar.length / this.OrdenesPorPagina);
    }
  }

  cambiarOrdenFecha(): void {
    if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sortColumn.next('fecha');
    this.ordenesPendientes.sort((a, b) => this.compararFechas(a, b));
    this.ordenesEnPreparacion.sort((a, b) => this.compararFechas(a, b));
    this.ordenesListasParaEntregar.sort((a, b) => this.compararFechas(a, b));
  }
  
  compararFechas(a: any, b: any): number {
    const fechaA = new Date(a.fecha).getTime();
    const fechaB = new Date(b.fecha).getTime();
    return this.sortDirection === 'asc' ? fechaA - fechaB : fechaB - fechaA;
  }

  cambiarOrdenImporte(): void {
    if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sortColumn.next('importe');
    this.ordenesPendientes.sort((a, b) => this.compararImporte(a, b));
    this.ordenesEnPreparacion.sort((a, b) => this.compararImporte(a, b));
    this.ordenesListasParaEntregar.sort((a, b) => this.compararImporte(a, b));
  }

  compararImporte(a: any, b: any): number {
    return this.sortDirection === 'asc' ? a.importe - b.importe : b.importe - a.importe;
  }


  verMas(orden: any): void {}
}
