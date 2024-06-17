import { Component, OnInit } from '@angular/core';
import { Insumo } from '../../models/insumo';
import { InsumosService } from '../../services/insumos/insumos.service';

@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.component.html',
  styleUrl: './insumos.component.scss'
})
export class InsumosComponent implements OnInit {
  insumos: Insumo[] = [];

  constructor(private insumosService: InsumosService) {}

  ngOnInit(): void {
    this.insumosService.getInsumos().subscribe((data: Insumo[]) => {
      this.insumos = data;
    });
  }
}
