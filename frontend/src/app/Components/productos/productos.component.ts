import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos/productos.service';
import { Router } from '@angular/router';
import { response } from 'express';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  
  constructor(private productoService: ProductosService, private router: Router, private sanitizer: DomSanitizer) {

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

  getSafeImageUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  seleccionarProducto(producto: Producto, event: Event){
    event.stopPropagation();
    this.selectedProducto = producto;
  }

  deselectProducto(event: Event) {
      this.selectedProducto = new Producto();
  }
}
