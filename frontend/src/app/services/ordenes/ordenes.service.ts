import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orden } from '../../models/orden';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private apiUrl = 'http://localhost:3000/ordenes'; // Actualiza la URL según sea necesario

  constructor(private http: HttpClient) { }

  getOrdenes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createOrden(orden: Orden): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, orden);
  }

  updateOrden(orden: Orden): Observable<Orden> {
    return this.http.put<Orden>(`${this.apiUrl}/${orden.id}`, orden);
  }

  getOrdenByUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${id}`);
  }

  getUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUsuarios`);
  }

  getInfoOrden(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getInfoOrden/${id}`);
  }

  updateEstadoOrden(id: number, estado: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/actualizarEstado/${id}`, {estado});
  }

  asignarPanadero(id: number, panadero: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asignarPanadero/${id}`, {panadero});
  }

  getPanaderos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getPanaderos`);
  }

}

