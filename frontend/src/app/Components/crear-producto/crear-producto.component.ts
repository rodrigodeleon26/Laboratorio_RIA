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
  
  ngOnInit(): void {
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

  mostrarInsumoForm() {
    this.mostrarInsumo = !this.mostrarInsumo;
  }

  confirmarInsumo() {
    //si insumoSeleccionado no es correcto o ya esta en la lista de insumosProducto, no hacer nada
    if (this.insumoSeleccionado == 0 || this.insumosProducto.find(insumo => insumo.insumoId === this.insumoSeleccionado || this.cantidadInsumo <= 0)) {
      return;
    }
    //crear la relacion insumo con el producto y guardarla en el array
      this.mostrarInsumo = false;
      this.insumosProducto.push({
        productoId: 0,
        insumoId: this.insumoSeleccionado,
        cantidad: this.cantidadInsumo 
      });
  }

  getInsumoNombre(id: number): string {
    let insumo = this.insumos.find(insumo => insumo.id == id);
    return insumo ? insumo.nombre : '';
  }

  eliminarInsumo(insumoId: number) {
    this.insumosProducto = this.insumosProducto.filter(insumo => insumo.insumoId !== insumoId);
  }

  enviarForm() {
    let producto = new Producto();
    producto.nombre = (document.getElementById('nombre') as HTMLInputElement).value;
    producto.precio = parseFloat((document.getElementById('precio') as HTMLInputElement).value);
    producto.descripcion = (document.getElementById('descripcion') as HTMLInputElement).value;
    //TODO: imagen

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
