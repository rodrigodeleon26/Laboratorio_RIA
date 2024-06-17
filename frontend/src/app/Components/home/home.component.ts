import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos/productos.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  productos: Producto[] = [];
  selectedProduct: any;

  constructor(private productoService: ProductosService, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.productoService.get().subscribe({
        next: (data) => {
          this.productos = data;
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

  openProductModal(product: any) {
    this.selectedProduct = product;
    var myModal = new bootstrap.Modal(document.getElementById('productModal'), {});
    myModal.show();
  }

}
