import { Component, OnInit } from '@angular/core';
import { OrdenesService } from '../../services/ordenes/ordenes.service';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {
  ordenes: any[] = [];

  constructor(private ordenesService: OrdenesService) { }

  ngOnInit(): void {
    this.ordenesService.getOrdenes().subscribe(data => {
      this.ordenes = data;
      console.log('Ordenes', data);
    }, error => {
      console.error('Error fetching orders', error);
    });
  }
}
