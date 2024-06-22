import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../models/producto';
import { Insumo } from '../../../models/insumo';
import { InsumoProducto } from '../../../interfaces/InsumoProducto';
import { ProductosService } from '../../../services/productos/productos.service';
import { InsumosService } from '../../../services/insumos/insumos.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-productos-con-modal',
  templateUrl: './productos-con-modal.component.html',
  styleUrl: './productos-con-modal.component.scss'
})
export class ProductosConModalComponent {

  constructor(private productoService: ProductosService, private insumosService: InsumosService, private sanitizer: DomSanitizer) {}

  insumos: Insumo[] = [];
  insumosProducto: InsumoProducto[] = [];
  insumoSeleccionado = 0;
  cantidadInsumo = 0;

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  filter = new FormControl('');

  productoSeleccionado: any = {
    id: null,
    nombre: '',
    precio: 0,
    descripcion: ''
  };

  ngOnInit(): void {
    this.productoService.get().subscribe({
      next: (data) => {
        this.productos = data;
        this.filtrarProductos(null);
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.insumosService.getInsumos().subscribe({
      next: (data) => {
        this.insumos = data;
        console.log(this.insumos);
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.filter.valueChanges.pipe(
      debounceTime(300), // Espera 300ms después de cada pulsación antes de aplicar el filtro
      distinctUntilChanged() // Aplica el filtro solo si el valor ha cambiado
    ).subscribe(value => {
      this.filtrarProductos(value);
    });
  }

  getSafeImageUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onFileChange(event: Event){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (this.productoSeleccionado) {
          this.productoSeleccionado.imagen = reader.result as string;
        }
      }
      reader.readAsDataURL(file);
    }
  }

  filtrarProductos(query: string | null): void {
    if (!query) {
      this.productosFiltrados = this.productos; // Si no hay consulta, muestra todos los productos
    } else {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query?.toLowerCase() || '')
      );
    }
  }

  verMas(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.productoService.getProductoInsumos(producto.id).subscribe({
      next: (data) => {
        this.insumosProducto = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  edit() {

    let requestBody = {
      producto: this.productoSeleccionado,
      insumosProducto: this.insumosProducto
    };
    console.log(requestBody);
    this.productoService.actualizarConInsumos(requestBody).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getInsumoNombre(id: number): string {
    let insumo = this.insumos.find(insumo => insumo.id == id);
    return insumo ? insumo.nombre : '';
  }

  eliminarInsumo(insumoId: number) {
    console.log("insumoID:" + insumoId, this.insumosProducto);
    this.insumosProducto = this.insumosProducto.filter(insumo => insumo.insumoId !== insumoId);
    console.log(this.insumosProducto);
  }

  addInsumo() {
    //evitar insumos repetidos y cantidades negativas
    if(this.insumosProducto.find(insumo => insumo.insumoId == this.insumoSeleccionado) || this.cantidadInsumo <= 0){
      return;
    }

    this.insumosProducto.push({
      productoId: this.productoSeleccionado.id,
      insumoId: this.insumoSeleccionado,
      cantidad: this.cantidadInsumo
    });
    this.insumoSeleccionado = 0;
    this.cantidadInsumo = 0;
  }

  public delete() {
    if(confirm('¿Estás seguro de eliminar el producto?')){
      // this.productos = this.productos.filter(x => x != this.selectedProducto);
      // this.selectedProducto = new Producto();
      this.productoService.delete(this.productoSeleccionado.id).subscribe({
        next: (data) => {
          console.log(data);
          this.productoService.get().subscribe({
            next: (data) => {
              this.productos = data;
              this.filtrarProductos(null);
            },
            error: (error) => {
              console.error(error);
            }
          });
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

}
