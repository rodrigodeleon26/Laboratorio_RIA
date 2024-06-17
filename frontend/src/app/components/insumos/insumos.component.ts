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
  insumos: Insumo[] = [];
  filter = new FormControl('');
  filteredInsumos$: Observable<Insumo[]> | undefined;

  constructor(private insumosService: InsumosService) {}

  ngOnInit(): void {
    this.insumosService.getInsumos().subscribe((data: Insumo[]) => {
      this.insumos = data;
    });

    this.filteredInsumos$ = this.filter.valueChanges.pipe(
      startWith(''),
      map((text) => this.search(text || '', this.insumos)) 
    );

    this.filter.setValue('');
  }

  search(text: string, insumos: Insumo[]): Insumo[] {
    return insumos.filter(insumo => {
      const term = text.toLowerCase();
      return insumo.nombre.toLowerCase().includes(term)
    });
  }
}