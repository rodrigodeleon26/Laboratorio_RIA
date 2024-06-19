import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMovilProductoComponent } from './modal-movil-producto.component';

describe('ModalMovilProductoComponent', () => {
  let component: ModalMovilProductoComponent;
  let fixture: ComponentFixture<ModalMovilProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalMovilProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalMovilProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
