import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeLogger } from '../models/TimeLogger.Model';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class TimeLoggerService {
  private readonly apiUrl = 'http://localhost:8000/api/hours'; // tu backend PHP

  constructor(private http: HttpClient) {}

  /** Obtener todos los registros */
  getRegistros(): Observable<TimeLogger[]> {
    return this.http.get<TimeLogger[]>(this.apiUrl);
  }

  /** Crear nuevo registro */
  agregarRegistro(registro: TimeLogger): Observable<any> {
    return this.http.post<any>(this.apiUrl, registro);
  }

  /** Actualizar registro */
  actualizarRegistro(id: number, registro: TimeLogger): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, registro);
  }

  /** Eliminar registro */
  eliminarRegistro(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
