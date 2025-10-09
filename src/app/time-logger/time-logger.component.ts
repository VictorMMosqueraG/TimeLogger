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

  ingresoTotal: number = 0;
  horasTotales: number = 0;
  promedioTarifa: number = 0;

  constructor(
    private timeLoggerService: TimeLoggerService,
    private authService: AuthService,
    private router: Router
  ) {
    // Se obtiene el observable de registros desde el servicio
    this.horas$ = this.timeLoggerService.getRegistros();
    // Cada vez que cambia la lista de registros (alta, baja, edición), se recalculan las estadísticas
    this.horas$.subscribe(registros => this.calculaStats(registros));
  }

  /**
   * Limpia el formulario
   */
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

  /**
   * Agrega un nuevo registro o actualiza uno existente si editandoId es diferente de null.
   * Primero valida los campos requeridos, calcula el ingreso y luego persiste en Firestore usando el servicio.
   */
  async guardarRegistro() {
    const r = this.registro;

    if (!r.cliente.trim() || !r.proyecto.trim() || !r.fecha.trim() || r.horas <= 0 || r.tarifaHora <= 0) {
      return alert(Messages.INVALID_VALUES);
    }

    r.ingreso = r.horas * r.tarifaHora;

    if (this.editandoId) {
      await this.timeLoggerService.actualizarRegistro(this.editandoId, r);
      this.editandoId = null;
    } else {
      r.uid = 'uid-demo';
      await this.timeLoggerService.agregarRegistro(r);
    }
    this.registro = this.blankRegistro();
  }

  /**
   * Solicita al servicio eliminar un registro por su id
   * @param id - id del registro en Firestore
   */
  async eliminarRegistro(id: string) {
    await this.timeLoggerService.eliminarRegistro(id);
  }

  /**
   * Prepara el formulario para editar un registro existente
   * Copia los datos y almacena el id del registro a editar
   * @param registro - Objeto con los datos actuales
   */
  editarRegistro(registro: TimeLogger) {
    this.editandoId = registro.id || null;
    this.registro = { ...registro };
  }

  /**
   * Recalcula las estadísticas globales (ingreso total, horas totales, tarifa promedio)
   * cada vez que cambia la lista de registros
   * @param registros - Array con todos los TimeLogger actuales
   */
  calculaStats(registros: TimeLogger[]) {
    this.ingresoTotal = registros.reduce((a, r) => a + r.ingreso, 0);
    this.horasTotales = registros.reduce((a, r) => a + r.horas, 0);
    this.promedioTarifa = this.horasTotales ? this.ingresoTotal / this.horasTotales : 0;
  }

  /**
   * Cierra la sesión del usuario y lo redirige al login
   */
  async cerrarSesion() {
    await this.authService.salir();
    this.router.navigate([AppRoutes.LOGIN]);
  }
}
