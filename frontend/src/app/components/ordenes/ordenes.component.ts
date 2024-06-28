import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdenesService } from '../../services/ordenes/ordenes.service';
import { AuthService } from '../../services/auth/auth.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { NgbDateStruct, NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs/operators';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {
  @ViewChild('nav', { static: true })
  nav!: NgbNav;

  private subscriptions: Subscription[] = [];
  ordenes: any[] = [];
  role = '';
  userId = 0;
  clientes: any[] = [];
  model!: NgbDateStruct;
  modelInicio!: {year: number, month: number, day: number} | null;
  modelFin!: { year: number; month: number; day: number; } | null;
  usuarioSeleccionado = '';

  paginaActual: number = 1;
  OrdenesPorPagina: number = 6;
  totalPaginas: number = 0;

  ordenesPendientes: any[] = [];
  ordenesEnPreparacion: any[] = [];
  ordenesListasParaEntregar: any[] = [];
  ordenesEntregadas: any[] = [];

  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn = new BehaviorSubject<string>('nombre');
  ordenSeleccionada: any = [];
  selectedEstado: string = '';
  selectedPanadero: number = 0;
  panaderos: any[] = [];
  insumosTotales: any = [];
  costoTotal: number = 0;

  constructor(private ordenesService: OrdenesService, private authService: AuthService, private usuarioService: UsuariosService, private modalService: NgbModal) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage && this.authService.isAuthenticated()) {
      const userSubscription = this.usuarioService.user.subscribe(user => {
        if (user) {
          this.role = user.role;
          this.userId = user.id;
  
          if (this.role === 'USER') {
            const userOrdersSubscription = this.ordenesService.getOrdenByUsuario(this.userId).pipe(
              tap(data => this.procesarOrdenes(data))
            ).subscribe(
              data => this.ordenes = data,
              error => console.error('Error fetching user orders', error)
            );
            this.subscriptions.push(userOrdersSubscription);
          } else {
            if (this.authService.isAuthenticated()) {
              const allOrdersSubscription = this.ordenesService.getOrdenes().pipe(
                tap(data => this.procesarOrdenes(data))
              ).subscribe(
                data => this.ordenes = data,
                error => console.error('Error fetching orders', error)
              );
              this.subscriptions.push(allOrdersSubscription);
            }
          }
        }
      });
      this.subscriptions.push(userSubscription);
  
      if (this.authService.isAuthenticated()) {
        const usuariosSubscription = this.ordenesService.getUsuarios().subscribe(
          data => this.clientes = data,
          error => console.error('Error fetching users', error)
        );
        this.subscriptions.push(usuariosSubscription);
  
        const panaderosSubscription = this.ordenesService.getPanaderos().subscribe(
          data => this.panaderos = data,
          error => console.error('Error fetching panaderos', error)
        );
        this.subscriptions.push(panaderosSubscription);
      }
    }
  }

  procesarInsumos() {
    this.ordenesService.getInsumosPendientes().subscribe(
      data => {
        console.log(data);
        this.insumosTotales = data;
      },
      error => console.error('Error fetching insumos', error)
    );
  }

  procesarInsumos2() {
    const ordenes = this.ordenesPendientes;
    const ordenesInfo: any[] = [];
    this.insumosTotales = [];
    this.costoTotal = 0;
  
    const requests = ordenes.map(orden =>
      this.ordenesService.getInfoOrden(orden.id).toPromise()
    );
  
    Promise.all(requests)
      .then(responses => {
        responses.forEach(data => {
          ordenesInfo.push(data);
        });

        ordenesInfo.forEach(orden => {
          orden.insumosTotales.forEach((insumo:any) => {
            const insumoExistente = this.insumosTotales.find((insumoTotal: any) => insumoTotal.nombre === insumo.nombre);
            //console.log("insumoExistente:" + insumoExistente, "insumo:" + insumo);
            if (insumoExistente) {
              //console.log("entro a if" + insumoExistente.nombre)
              insumoExistente.cantidad += insumo.cantidad;
            } else {
              //console.log("entro a else")
              this.insumosTotales.push({ ...insumo });
            }
          });
        });

        //calcular gasto total de cada insumo cantidad: 55.5 nombre: "Harina de trigo (1k)" precioUnitario: 30 totalCosto: 240
        this.insumosTotales.forEach((insumo: any) => {
          //asegurarse de que se redondee la cantidad a la unidad     
          const unidadesNecesarias = Math.ceil(insumo.cantidad);
          insumo.totalCosto = unidadesNecesarias * insumo.precioUnitario;
          this.costoTotal += insumo.totalCosto;
        })
      })
      .catch(error => console.error('Error fetching order info', error));
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  

  private procesarOrdenes(data: any[]): void {
    this.ordenesPendientes = data.filter(orden => orden.estado === 'PENDIENTE');
    this.ordenesEnPreparacion = data.filter(orden => orden.estado === 'EN PREPARACION');
    this.ordenesListasParaEntregar = data.filter(orden => orden.estado === 'LISTO PARA RECOGER');
    this.ordenesEntregadas = data.filter(orden => orden.estado === 'ENTREGADO');

    this.actualizarCantPaginas('PENDIENTE');
  }

  private reiniciarOrdenes(): void {
    this.ordenesPendientes = this.ordenes.filter(orden => orden.estado === 'PENDIENTE');
    this.ordenesEnPreparacion = this.ordenes.filter(orden => orden.estado === 'EN PREPARACION');
    this.ordenesListasParaEntregar = this.ordenes.filter(orden => orden.estado === 'LISTO PARA RECOGER');
    this.ordenesEntregadas = this.ordenes.filter(orden => orden.estado === 'ENTREGADO');
  }

  getPaginadasPendiente(): any[] {
    const inicio = (this.paginaActual - 1) * this.OrdenesPorPagina;
    const fin = inicio + this.OrdenesPorPagina;
    return this.ordenesPendientes.slice(inicio, fin);
  }

  getPaginadasEnPreparacion(): any[] {
    const inicio = (this.paginaActual - 1) * this.OrdenesPorPagina;
    const fin = inicio + this.OrdenesPorPagina;
    return this.ordenesEnPreparacion.slice(inicio, fin);
  }

  getPaginadasListasParaEntregar(): any[] {
    const inicio = (this.paginaActual - 1) * this.OrdenesPorPagina;
    const fin = inicio + this.OrdenesPorPagina;
    return this.ordenesListasParaEntregar.slice(inicio, fin);
  }

  getPaginadasEntregados(): any[] {
    const inicio = (this.paginaActual - 1) * this.OrdenesPorPagina;
    const fin = inicio + this.OrdenesPorPagina;
    return this.ordenesEntregadas.slice(inicio, fin);
  
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  actualizarCantPaginas(categoria: string): void {
    this.cambiarPagina(1);
    if (categoria === 'PENDIENTE') {
      this.totalPaginas = Math.ceil(this.ordenesPendientes.length / this.OrdenesPorPagina);
    } else if (categoria === 'EN PREPARACION') {
      this.totalPaginas = Math.ceil(this.ordenesEnPreparacion.length / this.OrdenesPorPagina);
    } else if (categoria === 'LISTO PARA RECOGER') {
      this.totalPaginas = Math.ceil(this.ordenesListasParaEntregar.length / this.OrdenesPorPagina);
    } else if (categoria === 'ENTREGADO') {
      this.totalPaginas = Math.ceil(this.ordenesEntregadas.length / this.OrdenesPorPagina);
    }
  }

  cambiarOrdenFecha(): void {
    if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sortColumn.next('fecha');
    this.ordenesPendientes.sort((a, b) => this.compararFechas(a, b));
    this.ordenesEnPreparacion.sort((a, b) => this.compararFechas(a, b));
    this.ordenesListasParaEntregar.sort((a, b) => this.compararFechas(a, b));
    this.ordenesEntregadas.sort((a, b) => this.compararFechas(a, b));
  }

  compararFechas(a: any, b: any): number {
    const fechaA = new Date(a.fecha).getTime();
    const fechaB = new Date(b.fecha).getTime();
    return this.sortDirection === 'asc' ? fechaA - fechaB : fechaB - fechaA;
  }

  cambiarOrdenImporte(): void {
    if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sortColumn.next('importe');
    this.ordenesPendientes.sort((a, b) => this.compararImporte(a, b));
    this.ordenesEnPreparacion.sort((a, b) => this.compararImporte(a, b));
    this.ordenesListasParaEntregar.sort((a, b) => this.compararImporte(a, b));
    this.ordenesEntregadas.sort((a, b) => this.compararImporte(a, b));
  }

  compararImporte(a: any, b: any): number {
    return this.sortDirection === 'asc' ? a.importe - b.importe : b.importe - a.importe;
  }

  filtrarOrdenes() {


    if (!this.modelInicio && !this.modelFin && !this.usuarioSeleccionado) {
      this.reiniciarOrdenes();
      this.nav.select(1);
      this.actualizarCantPaginas('PENDIENTE');
      return;
    }

    if (this.modelInicio && !this.modelFin) {
      alert('Debe seleccionar una fecha de fin');
      return;
    }
    if (!this.modelInicio && this.modelFin) {
      alert('Debe seleccionar una fecha de inicio');
      return;
    }

    this.reiniciarOrdenes();
    if(this.modelFin && this.modelInicio){

      console.log("entro a fecha" + this.modelFin + " " + this.modelInicio)

      const fechaInicio = new Date(this.modelInicio.year, this.modelInicio.month - 1, this.modelInicio.day);
      const fechaFin = new Date(this.modelFin.year, this.modelFin.month - 1, this.modelFin.day);
      fechaFin.setHours(23, 59, 59, 999);
    
      if (fechaInicio > fechaFin) {
        alert('La fecha de inicio no puede ser mayor a la fecha de fin');
        return;
      }
  
  
      this.ordenesPendientes = this.ordenesPendientes.filter(orden => {
        const fechaOrden = new Date(orden.fecha);
        return fechaOrden >= fechaInicio && fechaOrden <= fechaFin;
      });
  
      this.ordenesEnPreparacion = this.ordenesEnPreparacion.filter(orden => {
        const fechaOrden = new Date(orden.fecha);
        return fechaOrden >= fechaInicio && fechaOrden <= fechaFin;
      });
  
      this.ordenesListasParaEntregar = this.ordenesListasParaEntregar.filter(orden => {
        const fechaOrden = new Date(orden.fecha);
        return fechaOrden >= fechaInicio && fechaOrden <= fechaFin;
      });

      this.ordenesEntregadas = this.ordenesEntregadas.filter(orden => {
        const fechaOrden = new Date(orden.fecha);
        return fechaOrden >= fechaInicio && fechaOrden <= fechaFin;
      });

    }
    if(this.usuarioSeleccionado){
      const seleccion = this.usuarioSeleccionado.split(' | ');
      const idUsuario = seleccion[0]; // Aquí tienes el ID del usuario seleccionado
      // Puedes hacer algo con el ID del usuario aquí
      console.log(idUsuario);

      console.log(this.ordenesPendientes);
      this.ordenesPendientes = this.ordenesPendientes.filter(orden => orden.clienteId == idUsuario);
  
      this.ordenesEnPreparacion = this.ordenesEnPreparacion.filter(orden => orden.clienteId == idUsuario);
  
      this.ordenesListasParaEntregar = this.ordenesListasParaEntregar.filter(orden => orden.clienteId == idUsuario);

      this.ordenesEntregadas = this.ordenesEntregadas.filter(orden => orden.clienteId == idUsuario);
    }

    this.nav.select(1);
    this.actualizarCantPaginas('PENDIENTE');
  }

  limpiarFiltros() {
    //modeloInicio y modeloFin
    this.modelInicio = null;
    this.modelFin = null;
    this.usuarioSeleccionado = '';
    this.reiniciarOrdenes();
    this.nav.select(1);
    this.actualizarCantPaginas('PENDIENTE');
  }

  verMas(orden: any): void {
    this.ordenesService.getInfoOrden(orden.id).subscribe(
      data => this.ordenSeleccionada = data,
      error => console.error('Error fetching order info', error)
    );
    console.log(this.ordenSeleccionada);
  }

  guardarEstado(){
    console.log(this.selectedEstado);
    console.log(this.ordenSeleccionada.id);
    switch(this.selectedEstado){
      case '1':
        this.selectedEstado = 'PENDIENTE';
        break;
      case '2':
        this.selectedEstado = 'EN PREPARACION';
        break;
      case '3':
        this.selectedEstado = 'LISTO PARA RECOGER';
        break;
      case '4':
        this.selectedEstado = 'ENTREGADO';
        break;
      default:
        this.selectedEstado = 'PENDIENTE';
        break;
    }
    console.log(this.selectedEstado);

    this.ordenesService.updateEstadoOrden(this.ordenSeleccionada.id, this.selectedEstado).subscribe(
      data => {
        console.log(data);
        this.ordenesService.getOrdenes().pipe(
          tap(data => this.procesarOrdenes(data))
        ).subscribe(
          data => this.ordenes = data,
          error => console.error('Error fetching orders', error)
        );
      },
      error => console.error('Error updating order status', error)
    );
  }

  panaderoAcepta(){
    //el panadero acepta una orden para si
    this.ordenesService.asignarPanadero(this.ordenSeleccionada.id, this.userId).subscribe(
      data => {
        this.ordenSeleccionada = data;
        this.ordenesService.getOrdenes().pipe(
          tap(data => this.procesarOrdenes(data))
        ).subscribe(
          data => this.ordenes = data,
          error => console.error('Error fetching orders', error)
        );
      },
      error => console.error('Error updating order status', error)
    );
  }

  asignarPanadero() {
    //el administrador asigna un panadero a una orden
    console.log(this.selectedPanadero);
    this.ordenesService.asignarPanadero(this.ordenSeleccionada.id, this.selectedPanadero).subscribe(
      data => {
        this.ordenSeleccionada = data;
        this.selectedPanadero = 0;
        this.ordenesService.getOrdenes().pipe(
          tap(data => this.procesarOrdenes(data))
        ).subscribe(
          data => this.ordenes = data,
          error => console.error('Error fetching orders', error)
        );
      },
      error => console.error('Error updating order status', error)
    );
  }

}
