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
}

