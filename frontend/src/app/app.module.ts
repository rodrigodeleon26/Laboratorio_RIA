import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './Components/login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';

import { ProductosComponent } from './Components/productos/productos.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { InsumosComponent } from './Components/insumos/insumos.component';
import { CrearProductoComponent } from './Components/crear-producto/crear-producto.component';
import { ModalMovilProductoComponent } from './Components/productos/modal-movil-producto/modal-movil-producto.component';
import { ModalMovilProductoInsumoComponent } from './Components/productos/modal-movil-producto-insumo/modal-movil-producto-insumo.component';
import { CommonModule } from '@angular/common';
import { OrdenesComponent } from './Components/ordenes/ordenes.component';
import { GenerarOrdenComponent } from './Components/generar-orden/generar-orden.component';
import { EditarPerfilComponent } from './Components/editar-perfil/editar-perfil.component';
import { datePickerComponent } from './Components/date-picker/date-picker.component';

//import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
//import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ProductosConModalComponent } from './Components/productos/productos-con-modal/productos-con-modal.component';
import { ForgotPasswordComponent } from './Components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProductosComponent,
    HomeComponent,
    CrearProductoComponent,
    InsumosComponent,
    OrdenesComponent,
    GenerarOrdenComponent,
    ModalMovilProductoComponent,
    ModalMovilProductoInsumoComponent,
    InsumosComponent,
    EditarPerfilComponent,
    datePickerComponent,
    ProductosConModalComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbDatepickerModule,
    JsonPipe
  ],
  providers: [
    provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }