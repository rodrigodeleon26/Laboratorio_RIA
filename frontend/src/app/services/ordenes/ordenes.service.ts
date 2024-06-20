import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private apiUrl = 'http://localhost:3000/ordenes'; // Actualiza la URL según sea necesario

  constructor(private http: HttpClient) { }

  getOrdenes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
