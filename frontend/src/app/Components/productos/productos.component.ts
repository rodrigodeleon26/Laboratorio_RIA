import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  
  constructor(private productoService: ProductosService, private router: Router) {

  }

  productos: Producto[] = [];
  selectedProducto: Producto = new Producto();

  ngOnInit(): void {
    this.productoService.get().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  add() {
    this.productoService.post(this.selectedProducto).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  edit() {
    this.productoService.put(this.selectedProducto).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

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
      // this.productos = this.productos.filter(x => x != this.selectedProducto);
      // this.selectedProducto = new Producto();
      this.productoService.delete(this.selectedProducto.id).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

}
