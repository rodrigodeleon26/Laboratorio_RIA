import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from '../../services/productos/productos.service';
import { OrdenesService } from '../../services/ordenes/ordenes.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Orden } from '../../models/orden';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-generar-orden',
  templateUrl: './generar-orden.component.html',
  styleUrls: ['./generar-orden.component.scss']
})
export class GenerarOrdenComponent implements OnInit {
  productos: any[] = [];
  productosDisponibles: any[] = [];
  productosFiltrados: any[] = [];
  carrito: any[] = [];
  cantidadSeleccionada: number = 1;
  filtroProducto: string = '';

  paginaActual: number = 1;
  productosPorPagina: number = 6;
  totalPaginas: number = 0;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private productoService: ProductosService,
    private ordenesService: OrdenesService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.productoService.get().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosDisponibles = [...this.productos];
        this.filtrarProductos();
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
    this.filtrarProductos(); // Actualizar la lista de productos filtrados y paginados
    this.cantidadSeleccionada = 1; // Resetear la cantidad después de agregar
  }

  eliminarDelCarrito(item: any): void {
    this.carrito = this.carrito.filter(i => i.producto.id !== item.producto.id);
    this.productosDisponibles.push(item.producto);
    this.filtrarProductos(); // Actualizar la lista de productos filtrados y paginados
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  getSafeImageUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  crearOrden(): void {
    const nuevaOrden = this.construirNuevaOrden();
    this.ordenesService.createOrden(nuevaOrden).subscribe({
      next: (response) => {
        console.log('Orden creada con éxito:', response);
        // Aquí puedes manejar la respuesta del backend, como mostrar un mensaje de éxito, limpiar el carrito, etc.
      },
      error: (error) => {
        console.error('Error al crear la orden:', error);
        // Manejo de errores, como mostrar un mensaje de error al usuario
      }
    });
  }

  private construirNuevaOrden(): any {
      const orden = {
        fecha: new Date(),
        estado: 'PENDIENTE',
        importe: this.calcularTotalCarrito(),
        panaderiaId: null,
        clienteId: this.authService.getEmail()
      };

      // Construir los pedidos de la orden
      const pedidosOrden = this.carrito.map(item => {
        return {
          productoId: item.producto.id, // Suponiendo que tienes un campo 'id' en cada producto del carrito
          cantidad: item.cantidad,
        };
      });

      // Devolver la orden y los pedidos
      return {
        orden,
        pedidosOrden
      };
  }

  limpiarCarrito(): void {
    this.carrito = []; // Método para limpiar el carrito después de crear la orden
  }

  filtrarProductos(): void {
    const filtro = this.filtroProducto.toLowerCase();
    this.productosFiltrados = this.productosDisponibles.filter(producto =>
      producto.nombre.toLowerCase().includes(filtro)
    );
    this.totalPaginas = Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
    this.paginaActual = 1; // Resetear a la primera página después del filtrado
  }

  getProductosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    return this.productosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  calcularTotalCarrito(): number {
    return this.carrito.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }
}
