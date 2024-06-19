import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConectorModalService } from '../../../services/productos/conector-modal.service';
import { Producto } from '../../../models/producto';
import { InsumoProducto } from '../../../interfaces/InsumoProducto';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Insumo } from '../../../models/insumo';
import { ModalMovilProductoInsumoComponent } from '../modal-movil-producto-insumo/modal-movil-producto-insumo.component';

@Component({
	selector: 'ngbd-modal-stacked',
  template: `
		<div class="modal-header">
			<h4 class="modal-title">Modificar Producto</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">

        <div class="form-group mb-3">
            <input type="text" [(ngModel)]="selectedProducto.nombre" placeholder="Inserte nombre" class="form-control" [disabled]="!selectedProducto.id">
        </div>
        <div class="form-group mb-3">
            <input type="number" [(ngModel)]="selectedProducto.precio" placeholder="Inserte precio" class="form-control" [disabled]="!selectedProducto.id">
        </div>
        <div class="form-group mb-3">
            <input type="text" [(ngModel)]="selectedProducto.descripcion" placeholder="inserte descripcion" class="form-control" [disabled]="!selectedProducto.id">
        </div>
        <div class="form-group mb-3">
            <input type="file" (change)="onFileChange($event)" class="form-control" [disabled]="!selectedProducto.id">
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th scope="col" class="text-center">Nombre</th>
                    <th scope="col" class="text-center">Cantidad</th>
                    <th scope="col" class="text-center">Eliminar</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let insumo of insumosProducto" >
                    <td>{{getInsumoNombre(insumo.insumoId)}}</td>
                    <td class="d-flex justify-content-center h-100"><input class="w-50" style="height: 2.5rem;" min="1" type="number" [(ngModel)]="insumo.cantidad" value="{{insumo.cantidad}}"></td>
                    <td><button class="btn btn-danger" (click)="eliminarInsumo(insumo.insumoId)"><i class="bi bi-trash-fill"></i></button></td>
                </tr>
            </tbody>
        </table>

        <div class="d-flex justify-content-around">                        
            <button *ngIf="selectedProducto.id !== 0" (click)="edit()" class="btn btn-primary" [disabled]="!selectedProducto.id">
                Guardar
            </button>
            <button *ngIf="selectedProducto.id !== 0" type="button" class="btn btn-primary" (click)="open()">
                Agregar Insumo
            </button>
            <button *ngIf="selectedProducto.id !== 0" class="btn btn-danger" (click)="delete()" [disabled]="!selectedProducto.id">
                Eliminar
            </button>
        </div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Close</button>
		</div>
	`,
  styleUrl: './modal-movil-producto.component.scss'
})
export class ModalMovilProductoComponent {

  private modalService = inject(NgbModal);
	activeModal = inject(NgbActiveModal);

  constructor(private conectorModalService: ConectorModalService) {}

  ngOnInit() {
    // Suscríbete a data$ para ser notificado cuando el valor cambie
    this.conectorModalService.data$.subscribe(data => {
      // Haz algo con los datos
    });
  }

	open() {
		//this.modalService.open(NgbdModal2Content, { size: 'lg' });
    const modalRef = this.modalService.open(ModalMovilProductoInsumoComponent, { size: 'lg' });
    modalRef.componentInstance.insumos = this.insumos;
    modalRef.componentInstance.insumoSeleccionado = this.insumoSeleccionado;
    modalRef.componentInstance.cantidadInsumo = this.cantidadInsumo;
    //modalRef.componentInstance.addInsumo = this.addInsumo.bind(this);
    modalRef.componentInstance.addInsumo = this.addInsumo;

	}

  @Input() selectedProducto!: Producto;
  @Input() insumosProducto!: InsumoProducto[];
  @Input() insumos!: Insumo[];
  @Input() getSafeImageUrl!: (url: string) => SafeResourceUrl;
  @Input() onFileChange!: (event: Event) => void;
  @Input() getInsumoNombre!: (id: number) => string;
  @Input() eliminarInsumo!: (insumoId: number) => void;
  @Input() addInsumo!: () => void;
  @Input() edit!: () => void;
  @Input() delete!: () => void;
  @Input() insumoSeleccionado!: number;
  @Input() cantidadInsumo!: number;
}
