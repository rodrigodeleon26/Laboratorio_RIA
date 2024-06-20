import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMovilProductoInsumoComponent } from './modal-movil-producto-insumo.component';

describe('ModalMovilProductoInsumoComponent', () => {
  let component: ModalMovilProductoInsumoComponent;
  let fixture: ComponentFixture<ModalMovilProductoInsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalMovilProductoInsumoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalMovilProductoInsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
