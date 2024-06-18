import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Insumo } from '../../models/insumo';
import { InsumosService } from '../../services/insumos/insumos.service';

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
  sortColumn = new BehaviorSubject<string>('nombre'); // Inicialmente ordenado por nombre

  constructor(private insumosService: InsumosService) {}

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

  editarInsumo(insumo: Insumo): void {
    console.log('Editar insumo:', insumo);
    // Aquí puedes agregar la lógica para editar el insumo
  }
}
