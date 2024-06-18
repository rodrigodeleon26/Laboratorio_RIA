import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Insumo } from '../../models/insumo';
import { InsumosService } from '../../services/insumos/insumos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.component.html',
  styleUrls: ['./insumos.component.scss']
})
export class InsumosComponent implements OnInit {
  insumos$: Observable<Insumo[]> | undefined;
  insumosSorted$: Observable<Insumo[]> | undefined;
  filter = new FormControl('');
  sortDirection = new BehaviorSubject<string>('asc');
  sortColumn = new BehaviorSubject<string>('nombre');
  insumoEdit: Insumo = { id: 0, nombre: '', descripcion: '', precio: 0.0 };

  constructor(private insumosService: InsumosService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadInsumos();
    this.setupFilter();
    this.setupSorting();
  }

  loadInsumos() {
    this.insumos$ = this.insumosService.getInsumos();
  }

  setupFilter() {
    this.insumos$ = combineLatest([
      this.filter.valueChanges.pipe(startWith('')),
      this.insumosService.getInsumos()
    ]).pipe(
      map(([filterValue, insumos]) => this.search(filterValue ? filterValue : '', insumos))
    );
  }

  setupSorting() {
    this.insumosSorted$ = combineLatest([
      this.insumos$ || of([]),
      this.sortDirection,
      this.sortColumn
    ]).pipe(
      map(([insumos, sortDirection, sortColumn]) => this.sort(insumos, sortColumn, sortDirection))
    );
  }

  search(text: string, insumos: Insumo[]): Insumo[] {
    const term = text.toLowerCase();
    return insumos.filter(insumo =>
      insumo.nombre.toLowerCase().includes(term)
    );
  }

  sort(insumos: Insumo[], column: string, direction: string): Insumo[] {
    return insumos.slice().sort((a, b) => {
      if (column === 'precio') {
        return direction === 'asc' ? a.precio - b.precio : b.precio - a.precio;
      } else {
        const nameA = (a as any)[column].toUpperCase();
        const nameB = (b as any)[column].toUpperCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
      }
    });
  }

  sortBy(column: string) {
    if (column === this.sortColumn.value) {
      // Si ya estamos ordenando por esta columna, cambiamos la dirección
      this.sortDirection.next(this.sortDirection.value === 'asc' ? 'desc' : 'asc');
    } else {
      // Si estamos ordenando por una nueva columna, la establecemos como columna de ordenamiento
      this.sortColumn.next(column);
      this.sortDirection.next('asc'); // Orden ascendente por defecto
    }
  }

  openEditarInsumoModal(insumo: Insumo, content: TemplateRef<any>) {
    this.insumoEdit = { ...insumo }; // Hacemos una copia del insumo para evitar mutaciones
    console.log(this.insumoEdit);
    this.modalService.open(content, { centered: true });
  }

  editarInsumo() {
    if (this.insumoEdit.id) {
      this.insumosService.updateInsumo(this.insumoEdit).subscribe(updatedInsumo => {
        // Aquí puedes manejar el resultado de la actualización
        console.log('Insumo actualizado:', updatedInsumo);
        // Recargar la lista de insumos
        this.loadInsumos();
        // Cerrar modal
        this.modalService?.dismissAll();
      });
    }
  }
  
  eliminarInsumo(id: number) {
    if (confirm('¿Estás seguro de eliminar este insumo?')) {
      this.insumosService.deleteInsumo(id).subscribe(
        () => {
          // Eliminación exitosa, puedes actualizar la lista de insumos
          // Volver a cargar la lista de insumos después de la eliminación
          this.loadInsumos();
          this.modalService?.dismissAll();
        },
        error => {
          // Manejar el error si la eliminación falla
          console.error('Error al eliminar el insumo:', error);
        }
      );
    }
  }
  
  
}
