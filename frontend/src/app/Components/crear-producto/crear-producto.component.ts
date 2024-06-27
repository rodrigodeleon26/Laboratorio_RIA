import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { Insumo } from '../../models/insumo';
import { ProductosService } from '../../services/productos/productos.service';
import { InsumosService } from '../../services/insumos/insumos.service';
import { Router } from '@angular/router';
import { InsumoProducto } from '../../interfaces/InsumoProducto';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.scss'
})
export class CrearProductoComponent {

  constructor(private productoService: ProductosService, private insumosService: InsumosService, private router: Router) {}

  insumos: Insumo[] = [];
  insumosProducto: InsumoProducto[] = [];
  mostrarInsumo = false;
  insumoSeleccionado = 0;
  cantidadInsumo = 0;
  imagenBase64: string | ArrayBuffer | null = null;
  
  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage){
      this.insumosService.getInsumos().subscribe({
        next: (data) => {
          this.insumos = data;
          console.log(data);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  mostrarInsumoForm() {
    this.mostrarInsumo = !this.mostrarInsumo;
  }

  confirmarInsumo() {
    //si insumoSeleccionado no es correcto o ya esta en la lista de insumosProducto, no hacer nada
    if (this.insumoSeleccionado == 0 || this.insumosProducto.find(insumo => insumo.insumoId === this.insumoSeleccionado || this.cantidadInsumo <= 0)) {
      return;
    }
    if (this.cantidadInsumo <= 0) {
      return;
    }
    //crear la relacion insumo con el producto y guardarla en el array
      this.mostrarInsumo = false;
      this.insumosProducto.push({
        productoId: 0,
        insumoId: this.insumoSeleccionado,
        cantidad: this.cantidadInsumo 
      });
      this.insumoSeleccionado = 0; 
      this.cantidadInsumo = 0;
  }

  getInsumoNombre(id: number): string {
    let insumo = this.insumos.find(insumo => insumo.id == id);
    return insumo ? insumo.nombre : '';
  }

  eliminarInsumo(insumoId: number) {
    this.insumosProducto = this.insumosProducto.filter(insumo => insumo.insumoId !== insumoId);
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenBase64 = reader.result;
        console.log(this.imagenBase64);  // Para verificar la conversión
      };
      reader.readAsDataURL(file);
    }
  }

  enviarForm() {
    let producto = new Producto();
    producto.nombre = (document.getElementById('nombre') as HTMLInputElement).value;
    producto.precio = parseFloat((document.getElementById('precio') as HTMLInputElement).value);
    producto.descripcion = (document.getElementById('descripcion') as HTMLInputElement).value;
    // Verificar que imagenBase64 es de tipo string antes de asignarla
    if (typeof this.imagenBase64 === 'string') {
      producto.imagen = this.imagenBase64;
    } else {
      producto.imagen = '';  // O manejar el caso donde la imagen no está disponible
    }

    let requestBody = {
      producto: producto,
      insumosProducto: this.insumosProducto
    };

    console.log(requestBody);
    this.productoService.post(requestBody).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/productos']);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
