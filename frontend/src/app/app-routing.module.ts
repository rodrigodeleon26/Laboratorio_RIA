import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { ProductosComponent } from './Components/productos/productos.component';
import { HomeComponent } from './Components/home/home.component';

const routes: Routes = [

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
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {



}
