import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../../models/producto'; // Asegúrate de importar correctamente el modelo
import { Insumo } from '../../../models/insumo';
import { InsumoProducto } from '../../../interfaces/InsumoProducto';
import { ProductosService } from '../../../services/productos/productos.service';
import { InsumosService } from '../../../services/insumos/insumos.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';



@Component({
  selector: 'app-productos-con-modal',
  templateUrl: './productos-con-modal.component.html',
  styleUrls: ['./productos-con-modal.component.scss']
})
export class ProductosConModalComponent implements OnInit {

  productoForm: FormGroup; // FormGroup para Reactive Forms

  insumos: Insumo[] = [];
  insumosProducto: InsumoProducto[] = [];
  insumosDisponibles: Insumo[] = [];

  insumoSeleccionado = 0;
  cantidadInsumo = 0;

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  filter = new FormControl('');

  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';

  productoSeleccionado: Producto = new Producto(); // Declarar el tipo Producto aquí

  constructor(
    private productoService: ProductosService,
    private insumosService: InsumosService,
    private sanitizer: DomSanitizer

  ) {
    this.productoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      precio: new FormControl(1, [Validators.required, Validators.min(0.01)]),
      descripcion: new FormControl('', [Validators.required]),
      imagen: new FormControl('')
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.productoService.get().subscribe({
        next: (data) => {
          this.productos = data;
          this.filtrarProductos(null);
          console.log('Productos cargados:', this.productos); // Verificar que los productos se carguen correctamente
        },
        error: (error) => {
          console.error(error);
        }
      });
      this.insumosService.getInsumos().subscribe({
        next: (data) => {
          this.insumos = data;
          this.actualizarInsumosDisponibles(); // Actualizar insumos disponibles inicialmente
          console.log('Insumos cargados:', this.insumos); // Verificar que los insumos se carguen correctamente
        },
        error: (error) => {
          console.error(error);
        }
      });
  
      this.filter.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(value => {
        this.filtrarProductos(value);
      });
    }
  }  

  getSafeImageUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (this.productoSeleccionado) {
          this.productoSeleccionado.imagen = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  filtrarProductos(query: string | null): void {
    if (!query) {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query?.toLowerCase() || '')
      );
    }
  }

  verMas(producto: Producto): void {
    this.productoSeleccionado = { ...producto }; // Copiar el objeto producto para evitar referencias compartidas
    if (typeof window !== 'undefined' && window.localStorage) {
      this.productoService.getProductoInsumos(producto.id).subscribe({
        next: (data) => {
          this.insumosProducto = data;
          this.actualizarInsumosDisponibles(); // Actualizar insumos disponibles al cargar los insumos del producto
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
  
  actualizarInsumosDisponibles() {
    this.insumosDisponibles = this.insumos.filter(insumo => {
      return !this.insumosProducto.some(ip => ip.insumoId === insumo.id);
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
        this.alertMessage = 'Producto actualizado correctamente';
        this.alertType = 'success';
        this.setAutoCloseAlert(3000);

        console.log(data);
        // Actualizar la lista de productos después de editar
        this.productoService.get().subscribe({
          next: (data) => {
            this.productos = data;
            this.filtrarProductos(null); // Aplicar filtros si es necesario

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

  private setAutoCloseAlert(timeout: number) {
    setTimeout(() => {
      this.alertMessage = '';
    }, timeout);
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
    if (this.insumosProducto.find(insumo => insumo.insumoId == this.insumoSeleccionado) || this.cantidadInsumo <= 0) {
      return;
    }
  
    this.insumosProducto.push({
      productoId: this.productoSeleccionado.id,
      insumoId: this.insumoSeleccionado,
      cantidad: this.cantidadInsumo
    });
  
    this.actualizarInsumosDisponibles();
  
    this.insumoSeleccionado = 0;
    this.cantidadInsumo = 0;
  }

  delete() {
    if (confirm('¿Estás seguro de eliminar el producto?')) {
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
