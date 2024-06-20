import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { ProductosComponent } from './Components/productos/productos.component';
import { CrearProductoComponent } from './Components/crear-producto/crear-producto.component';
import { HomeComponent } from './Components/home/home.component';
import { InsumosComponent } from './Components/insumos/insumos.component';
import { OrdenesComponent } from './components/ordenes/ordenes.component';
import { GenerarOrdenComponent } from './components/generar-orden/generar-orden.component';

const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

  { 
    path: 'login', 
    component: LoginComponent 
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'productos',
    component: ProductosComponent
  },

  {
    path: 'crearProducto',
    component: CrearProductoComponent
  },

  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'insumos',
    component: InsumosComponent
  },

  {
    path: 'ordenes',
    component: OrdenesComponent
  },

  {
    path: 'ordenar',
    component: GenerarOrdenComponent
  },
  
  { path: '**', redirectTo: '', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
