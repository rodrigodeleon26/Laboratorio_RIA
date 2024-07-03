import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';
import { Insumo } from '../../models/insumo';
import { ProductosService } from '../../services/productos/productos.service';
import { InsumosService } from '../../services/insumos/insumos.service';
import { InsumoProducto } from '../../interfaces/InsumoProducto';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss']
})
export class CrearProductoComponent implements OnInit {

  insumos: Insumo[] = [];
  insumosProducto: InsumoProducto[] = [];
  insumosDisponibles: Insumo[] = [];
  mostrarInsumo = false;
  insumoSeleccionado = 0;
  cantidadInsumo = 0;
  imagenBase64: string | ArrayBuffer | null = null;
  productoForm!: FormGroup;

  constructor(
    private productoService: ProductosService,
    private insumosService: InsumosService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(1)]],
      imagen: [null, [Validators.required]],
      insumoSeleccionado: ['0'],
      cantidadInsumo: ['']
    });

    if (typeof window !== 'undefined' && window.localStorage) {
      this.insumosService.getInsumos().subscribe({
        next: (data) => {
          this.insumos = data;
          this.insumosDisponibles = [...this.insumos]; // Inicializa la lista de insumos disponibles
          console.log('Insumos disponibles iniciales:', this.insumosDisponibles);
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
    const insumoSeleccionado = +this.productoForm.get('insumoSeleccionado')!.value;
    const cantidadInsumo = +this.productoForm.get('cantidadInsumo')!.value;
  
    if (insumoSeleccionado === 0 || cantidadInsumo <= 0 || this.insumosProducto.find(ip => ip.insumoId === insumoSeleccionado)) {
      return;
    }
  
    console.log('Agregando insumo:', insumoSeleccionado, 'Cantidad:', cantidadInsumo);
    this.mostrarInsumo = false;
    this.insumosProducto.push({
      productoId: 0,
      insumoId: insumoSeleccionado,
      cantidad: cantidadInsumo 
    });
  
    // Actualizar insumos disponibles
    this.insumosDisponibles = this.insumosDisponibles.filter(insumo => insumo.id !== insumoSeleccionado);
  
    // Reseteando los valores en el formulario reactivo
    this.productoForm.patchValue({
      insumoSeleccionado: '0',
      cantidadInsumo: ''
    });
  }
  

  getInsumoNombre(id: number): string {
    let insumo = this.insumos.find(insumo => insumo.id == id);
    return insumo ? insumo.nombre : '';
  }

  eliminarInsumo(insumoId: number) {
    console.log('Eliminando insumo:', insumoId);
    this.insumosProducto = this.insumosProducto.filter(ip => ip.insumoId !== insumoId);
  
    // Agregar el insumo eliminado de vuelta a insumosDisponibles
    const insumoEliminado = this.insumos.find(insumo => insumo.id === insumoId);
    if (insumoEliminado) {
      this.insumosDisponibles.push(insumoEliminado);
    }
  }
  


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenBase64 = reader.result;
        this.productoForm.patchValue({ imagen: this.imagenBase64 });
      };
      reader.readAsDataURL(file);
    }
  }

  enviarForm() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const producto = new Producto();
    producto.nombre = this.productoForm.value.nombre;
    producto.descripcion = this.productoForm.value.descripcion;
    producto.precio = this.productoForm.value.precio;
    producto.imagen = this.imagenBase64 as string;

    const requestBody = {
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
