import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductosComponent } from './components/productos/productos.component';
import { HomeComponent } from './components/home/home.component';
import { InsumosComponent } from './components/insumos/insumos.component';

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
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'insumos',
    component: InsumosComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
