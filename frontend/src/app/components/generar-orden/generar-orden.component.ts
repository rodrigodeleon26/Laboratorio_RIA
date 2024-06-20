import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from '../../services/productos/productos.service';
import { OrdenesService } from '../../services/ordenes/ordenes.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-generar-orden',
  templateUrl: './generar-orden.component.html',
  styleUrl: './generar-orden.component.scss'
})
export class GenerarOrdenComponent implements OnInit {
  productos: any[] = [];
  productosDisponibles: any[] = [];
  carrito: any[] = [];
  cantidadSeleccionada: number = 1;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private productoService: ProductosService,
    private ordenesService: OrdenesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.productoService.get().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosDisponibles = [...this.productos];
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  agregarAlCarrito(producto: any, cantidad: number): void {
    const productoEnCarrito = this.carrito.find(item => item.producto.id === producto.id);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad += cantidad;
    } else {
      this.carrito.push({ producto, cantidad });
    }
    this.productosDisponibles = this.productosDisponibles.filter(p => p.id !== producto.id);
    this.cantidadSeleccionada = 1; // Resetear la cantidad después de agregar
  }

  eliminarDelCarrito(item: any): void {
    this.carrito = this.carrito.filter(i => i.producto.id !== item.producto.id);
    this.productosDisponibles.push(item.producto);
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  getSafeImageUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  crearOrden(): void {
    // Implementar la lógica para crear una orden usando ordenesService
    console.log('Orden creada:', this.carrito);
  }

  calcularTotalCarrito(): number {
    return this.carrito.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }
}
