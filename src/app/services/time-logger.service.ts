import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeLogger } from '../models/TimeLogger.Model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TimeLoggerService {
  private readonly apiUrl = 'http://localhost:3001/timeloger';

  constructor(private http: HttpClient) {}

  getRegistros(): Observable<TimeLogger[]> {
    return this.http.get<TimeLogger[]>(this.apiUrl);
  }

  agregarRegistro(registro: TimeLogger): Observable<any> {
    return this.http.post<any>(this.apiUrl, registro);
  }

  actualizarRegistro(id: string | number, registro: TimeLogger): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${String(id)}`, registro);
  }

  eliminarRegistro(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${String(id)}`);
  }
}
