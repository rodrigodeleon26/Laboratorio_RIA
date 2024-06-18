import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
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
  filter = new FormControl('');

  constructor(private insumosService: InsumosService) {}

  ngOnInit(): void {
    this.loadInsumos();
    this.setupFilter();
  }

  loadInsumos() {
    this.insumos$ = this.insumosService.getInsumos();
  }

  setupFilter() {
    this.filter.valueChanges.pipe(
      startWith('')
    ).subscribe(() => {
      const filterValue = this.filter.value;
      this.insumos$ = this.filterInsumos(filterValue ? filterValue : '');
    });
  }

  filterInsumos(text: string): Observable<Insumo[]> {
    return this.insumosService.getInsumos().pipe(
      map(insumos => this.search(text, insumos))
    );
  }

  search(text: string, insumos: Insumo[]): Insumo[] {
    const term = text.toLowerCase();
    return insumos.filter(insumo =>
      insumo.nombre.toLowerCase().includes(term)
    );
  }
}
