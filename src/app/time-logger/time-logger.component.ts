import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { TimeLogger } from '../models/TimeLogger.Model';
import { AuthService } from '../services/auth.service';
import { TimeLoggerService } from '../services/time-logger.service';
import { Router } from '@angular/router';
import { AppRoutes } from '../commonds/appRoutes';
import { Messages } from '../commonds/message';

@Component({
  selector: 'app-time-logger',
  standalone: true,
  imports: [FormsModule, NgFor, AsyncPipe, DecimalPipe, NgIf],
  templateUrl: './time-logger.component.html',
  styleUrl: './time-logger.component.css'
})
export class TimeLoggerComponent {
  registro: TimeLogger = this.blankRegistro();
  editandoId: string | null = null;
  horas$: Observable<TimeLogger[]>;

  ingresoTotal = 0;
  horasTotales = 0;
  promedioTarifa = 0;

  constructor(
    private timeLoggerService: TimeLoggerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.horas$ = this.timeLoggerService.getRegistros();
    this.horas$.subscribe(registros => this.calculaStats(registros));
  }

  blankRegistro(): TimeLogger {
    return {
      cliente: '',
      proyecto: '',
      fecha: '',
      horas: 0,
      tarifaHora: 0,
      ingreso: 0,
      uid: ''
    };
  }

  private isValidId(id: any): boolean {
    if (id == null) return false;
    const asNumber = Number(id);
    if (!Number.isNaN(asNumber) && Number.isInteger(asNumber) && asNumber > 0) return true;
    if (typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)) return true;
    return false;
  }

  guardarRegistro(): void {
    const r = this.registro;
    if (!r.cliente.trim() || !r.proyecto.trim() || !r.fecha.trim() || r.horas <= 0 || r.tarifaHora <= 0) {
      alert(Messages.INVALID_VALUES);
      return;
    }

    r.ingreso = r.horas * r.tarifaHora;
    r.uid = 'uid-demo';

    if (this.editandoId) {
      this.timeLoggerService.actualizarRegistro(this.editandoId, r).subscribe({
        next: () => this.recargar(),
        error: err => alert('Error al actualizar: ' + err.message)
      });
    } else {
      this.timeLoggerService.agregarRegistro(r).subscribe({
        next: () => this.recargar(),
        error: err => alert('Error al guardar: ' + err.message)
      });
    }

    this.registro = this.blankRegistro();
    this.editandoId = null;
  }

  eliminarRegistro(id: string | number | undefined): void {
    console.log('Eliminar id recibido:', id, typeof id);
    if (!this.isValidId(id)) {
      alert('Id inválido — no se realiza la petición (evita NaN).');
      return;
    }
    if (confirm('¿Seguro que deseas eliminar este registro?')) {
      this.timeLoggerService.eliminarRegistro(String(id)).subscribe({
        next: () => this.recargar(),
        error: err => alert('Error al eliminar: ' + err.message)
      });
    }
  }

  editarRegistro(registro: TimeLogger): void {
    this.editandoId = registro.id ?? null;
    this.registro = { ...registro };
  }

  calculaStats(registros: TimeLogger[]): void {
    this.ingresoTotal = registros.reduce((a, r) => a + (r.ingreso || 0), 0);
    this.horasTotales = registros.reduce((a, r) => a + (r.horas || 0), 0);
    this.promedioTarifa = this.horasTotales ? this.ingresoTotal / this.horasTotales : 0;
  }

  private recargar(): void {
    this.horas$ = this.timeLoggerService.getRegistros();
    this.horas$.subscribe(registros => this.calculaStats(registros));
  }

  async cerrarSesion() {
    await this.authService.salir();
    this.router.navigate([AppRoutes.LOGIN]);
  }
}
