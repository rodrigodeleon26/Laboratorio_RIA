import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConectorModalService } from '../../../services/productos/conector-modal.service';
import { Producto } from '../../../models/producto';
import { InsumoProducto } from '../../../interfaces/InsumoProducto';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Insumo } from '../../../models/insumo';

@Component({
  selector: 'app-modal-movil-producto-insumo',
  template: `
		<div class="modal-header">
			<h4 class="modal-title">Agregar Insumo</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">

        <form>
            <div class="mb-3">
                <label for="selectInsumos">Insumo</label>
                <select class="form-select" aria-label="Default select example" name="insumos" id="selectInsumos" [(ngModel)]="insumoSeleccionado">
                    <option [value]="0" selected>Seleccionar Insumo</option>
                    <option *ngFor="let insumo of insumos" [value]="insumo.id">{{insumo.nombre}}</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="cantidad">Cantidad</label>
                <input type="number" min="0.1" step="0.1" class="form-control" id="cantidad" [(ngModel)]="cantidadInsumo" name="cantidadInsumo" placeholder="Cantidad necesaria">
            </div>
        </form>

		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Cerrar</button>
      <button type="button" class="btn btn-primary" (click)="addInsumo()">Agregar</button>
		</div>
	`,
  styleUrl: './modal-movil-producto-insumo.component.scss'
})
export class ModalMovilProductoInsumoComponent {

  private modalService = inject(NgbModal);
	activeModal = inject(NgbActiveModal);

  constructor(private conectorModalService: ConectorModalService) {}

  ngOnInit() {
    // Suscríbete a data$ para ser notificado cuando el valor cambie
    this.conectorModalService.data$.subscribe(data => {
      // Haz algo con los datos
    });
  }
  
  @Input() insumos!: Insumo[];
  @Input() insumoSeleccionado!: number;
  @Input() cantidadInsumo!: number;
  @Input() addInsumo!: () => void;
}
