// insumos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insumo } from '../../models/insumo';

@Injectable({
  providedIn: 'root'
})
export class InsumosService {
  private apiUrl = 'http://localhost:3000/insumos';

  constructor(private http: HttpClient) {}

  // Obtener todos los insumos
  getInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.apiUrl);
  }

  // Obtener un insumo por ID
  getInsumoById(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.apiUrl}/${id}`);
  }

  // Agregar un nuevo insumo
  createInsumo(insumo: Insumo): Observable<Insumo> {
    return this.http.post<Insumo>(this.apiUrl, insumo);
  }

  // Actualizar un insumo existente
  updateInsumo(insumo: Insumo): Observable<Insumo> {
    return this.http.put<Insumo>(`${this.apiUrl}/${insumo.id}`, insumo);
  }

  // Eliminar un insumo
  deleteInsumo(id: number): Observable<Insumo> {
    return this.http.delete<Insumo>(`${this.apiUrl}/${id}`);
  }
}
