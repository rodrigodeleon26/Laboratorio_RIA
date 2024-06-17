import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../models/producto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/productos'; 

  constructor(private http: HttpClient) {}

  get(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // getById(id: number): Observable<Producto> {
  //   return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  // }

  //agregar un producto
  post(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  //actualizar un producto
  put(producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${producto.id}`, producto);
  }

  delete(id: number): Observable<Producto> {
    return this.http.delete<Producto>(`${this.apiUrl}/${id}`);
  }

}
