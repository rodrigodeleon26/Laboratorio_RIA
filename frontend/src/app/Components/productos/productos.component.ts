import { Component } from '@angular/core';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {

  productos: Producto[] = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 10.0 },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción 2', imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 20.0 },
    { id: 3, nombre: 'Producto 3', descripcion: 'Descripción 3', imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 30.0 },
    { id: 4, nombre: 'Producto 4', descripcion: 'Descripción 4', imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 40.0 },
    { id: 5, nombre: 'Producto 5', descripcion: 'Descripción 5', imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 50.0 },
  ];

  selectedProducto: Producto = new Producto();

  addOrEdit() {
    if(this.selectedProducto.id === 0){
      this.selectedProducto.id = this.productos.length + 1;
      this.productos.push(this.selectedProducto);
    }

    this.selectedProducto = new Producto();
  }

  openForEdit(producto: Producto) {
    this.selectedProducto = producto;
  }

  delete() {
    if(confirm('¿Estás seguro de eliminar el producto?')){
      this.productos = this.productos.filter(x => x != this.selectedProducto);
      this.selectedProducto = new Producto();
    }
  }

}
