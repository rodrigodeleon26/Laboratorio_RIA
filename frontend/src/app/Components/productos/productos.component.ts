import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos/productos.service';
import { InsumosService } from '../../services/insumos/insumos.service';
import { Router } from '@angular/router';
import { response } from 'express';
import { Insumo } from '../../models/insumo';
import { InsumoProducto } from '../../interfaces/InsumoProducto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  
  constructor(private productoService: ProductosService, private insumosService: InsumosService, private router: Router, private sanitizer: DomSanitizer) {

  }

  productos: Producto[] = [];
  insumos: Insumo[] = [];
  insumosProducto: InsumoProducto[] = [];
  selectedProducto: Producto = new Producto();
  cantidadInsumo = 0;
  insumoSeleccionado = 0;

  ngOnInit(): void {
    this.productoService.get().subscribe({
      next: (data) => {
        this.productos = data;
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
  }

  edit() {

    let requestBody = {
      producto: this.selectedProducto,
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
    this.productoService.getProductoInsumos(producto.id).subscribe({
      next: (data) => {
        this.insumosProducto = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  deselectProducto(event: Event) {
      this.selectedProducto = new Producto();
      this.insumosProducto = [];
  }

  onFileChange(event: Event){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedProducto.imagen = reader.result as string;
      }
      reader.readAsDataURL(file);
    }
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
      productoId: this.selectedProducto.id,
      insumoId: this.insumoSeleccionado,
      cantidad: this.cantidadInsumo
    });
    this.insumoSeleccionado = 0;
    this.cantidadInsumo = 0;
  }
}
