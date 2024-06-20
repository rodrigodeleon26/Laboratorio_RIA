import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from '../../services/productos/productos.service';
import { OrdenesService } from '../../services/ordenes/ordenes.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-generar-orden',
  templateUrl: './generar-orden.component.html',
  styleUrls: ['./generar-orden.component.scss']
})
export class GenerarOrdenComponent implements OnInit {
  productosDisponibles: any[] = [];
  productosFiltrados: any[] = [];
  carrito: { producto: any, cantidad: number }[] = [];
  filtroProducto: string = '';

  paginaActual: number = 1;
  productosPorPagina: number = 6;
  totalPaginas: number = 0;

  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';

  constructor(
    private offcanvasService: NgbOffcanvas,
    private productoService: ProductosService,
    private ordenesService: OrdenesService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.productoService.get().subscribe({
      next: (data) => {
        this.productosDisponibles = [...data];
        this.filtrarProductos();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  agregarAlCarrito(producto: any, cantidad: number): void {
    if (cantidad <= 0) {
      this.alertMessage = 'La cantidad debe ser un número mayor a 0';
      this.alertType = 'danger';
      return;
    }

    const productoEnCarrito = this.carrito.find(item => item.producto.id === producto.id);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad += cantidad;
    } else {
      this.carrito.push({ producto, cantidad });
    }

    // Restaurar la cantidad seleccionada a 1 para este producto específico
    producto.cantidadSeleccionada = 1;

    this.productosDisponibles = this.productosDisponibles.filter(p => p.id !== producto.id);
    this.filtrarProductos(); // Actualizar la lista de productos filtrados y paginados
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
    if (this.carrito.length === 0) {
      this.alertMessage = 'No hay productos en el carrito';
      this.alertType = 'danger';
      this.offcanvasService.dismiss();
      return;
    }
    const nuevaOrden = this.construirNuevaOrden();
    console.log('Nueva orden:', nuevaOrden);
    this.ordenesService.createOrden(nuevaOrden).subscribe({
      next: (response) => {
        this.limpiarCarrito();
        this.cargarProductos();
        this.offcanvasService.dismiss();
        this.alertMessage = 'Orden creada correctamente';
        this.alertType = 'success';
        this.setAutoCloseAlert(3000); // Cerrar alert después de 3 segundos
      },
      error: (error) => {
        console.error('Error al crear la orden:', error);
        this.alertMessage = 'Error al crear la orden';
        this.alertType = 'danger';
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
      clienteId: this.authService.getId() // Suponiendo que tienes un método para obtener el ID del usuario autenticado
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

  setAutoCloseAlert(timeout: number) {
    setTimeout(() => {
      this.alertMessage = '';
    }, timeout);
  }
}
