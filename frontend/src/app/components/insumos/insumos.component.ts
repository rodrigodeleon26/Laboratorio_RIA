import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
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
  insumos$: BehaviorSubject<Insumo[]> = new BehaviorSubject<Insumo[]>([]);
  insumosFilteredAndSorted$: Observable<Insumo[]> | undefined;
  filter = new FormControl('');
  sortDirection = new BehaviorSubject<string>('asc');
  sortColumn = new BehaviorSubject<string>('nombre');
  insumoEdit: Insumo = { id: 0, nombre: '', descripcion: '', precio: 0.0 };

  constructor(private insumosService: InsumosService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadInsumos();
    this.setupFilterAndSorting();
  }

  loadInsumos() {
    this.insumosService.getInsumos().subscribe(insumos => {
      this.insumos$.next(insumos);
    });
  }

  setupFilterAndSorting() {
    this.insumosFilteredAndSorted$ = combineLatest([
      this.insumos$,
      this.filter.valueChanges.pipe(startWith('')),
      this.sortDirection,
      this.sortColumn
    ]).pipe(
      map(([insumos, filterValue, sortDirection, sortColumn]) => {
        let filteredInsumos = this.search(filterValue || '', insumos);
        return this.sort(filteredInsumos, sortColumn, sortDirection);
      })
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
      this.sortDirection.next(this.sortDirection.value === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.next(column);
      this.sortDirection.next('asc');
    }
  }

  openEditarInsumoModal(insumo: Insumo, content: TemplateRef<any>) {
    this.insumoEdit = { ...insumo };
    this.modalService.open(content, { centered: true });
  }

  openAgregarInsumoModal(content: TemplateRef<any>) {
    this.insumoEdit = { id: 0, nombre: '', descripcion: '', precio: 0.0 };
    this.modalService.open(content, { centered: true });
  }

  editarInsumo() {
    if (this.insumoEdit.id) {
      this.insumosService.updateInsumo(this.insumoEdit).subscribe(
        updatedInsumo => {
          this.loadInsumos();
          this.modalService?.dismissAll();
        },
        error => {
          console.error('Error al actualizar el insumo:', error);
        }
      );
    } else {
      this.insumosService.createInsumo(this.insumoEdit).subscribe(
        newInsumo => {
          this.loadInsumos();
          this.modalService?.dismissAll();
        },
        error => {
          console.error('Error al crear el insumo:', error);
        }
      );
    }
  }

  eliminarInsumo(id: number) {
    this.insumosService.deleteInsumo(id).subscribe(
      () => {
        this.loadInsumos();
        this.modalService?.dismissAll();
      },
      error => {
        console.error('Error al eliminar el insumo:', error);
      }
    );
  }
}
