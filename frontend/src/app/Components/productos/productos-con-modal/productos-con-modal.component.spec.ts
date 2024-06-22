import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosConModalComponent } from './productos-con-modal.component';

describe('ProductosConModalComponent', () => {
  let component: ProductosConModalComponent;
  let fixture: ComponentFixture<ProductosConModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductosConModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductosConModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
