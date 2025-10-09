import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TimeLogger } from '../models/TimeLogger.Model';

@Component({
  selector: 'app-time-logger',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    AsyncPipe,
    DecimalPipe,
    NgIf
  ],
  templateUrl: './time-logger.component.html',
  styleUrl: './time-logger.component.css'
})
export class TimeLoggerComponent {
   // Modelo para el formulario (persistente para edición)
  registro: TimeLogger = this.blankRegistro();
  editandoId: string | null = null;

  // Referencia Firestore
  horasRef: CollectionReference<DocumentData>;
  horas$: Observable<TimeLogger[]>;

  // Estadísticas
  ingresoTotal: number = 0;
  horasTotales: number = 0;
  promedioTarifa: number = 0;

  constructor(private firestore: Firestore) {
    this.horasRef = collection(this.firestore, 'horas');
    this.horas$ = collectionData(this.horasRef, { idField: 'id' }) as Observable<TimeLogger[]>;
    // Tip: puedes suscribirte y calcular estadísticas al recibir datos si necesitas mostrar totales reactivos.
    this.horas$.subscribe(registros => this.calculaStats(registros));
  }

  // Regresa un modelo en blanco
  blankRegistro(): TimeLogger {
    return {
      cliente: '',
      proyecto: '',
      fecha: '',
      horas: 0,
      tarifaHora: 0,
      ingreso: 0,
      uid: '' // aquí pondrás el uid del usuario según tu sistema
    };
  }

  // Valida y guarda/edita el registro
  async guardarRegistro() {
    const r = this.registro;
    // Validaciones: horas > 0, tarifa > 0, campos requeridos
    if (
      !r.cliente.trim() || !r.proyecto.trim() || !r.fecha.trim() ||
      r.horas <= 0 || r.tarifaHora <= 0
    ) return alert('Todos los campos son obligatorios y los valores deben ser mayores a 0.');

    r.ingreso = r.horas * r.tarifaHora;

    if (this.editandoId) {
      const ref = doc(this.firestore, `horas/${this.editandoId}`);
      await updateDoc(ref, r as any);
      this.editandoId = null;
    } else {
      // UID debería ser del usuario actual autenticado
      r.uid = 'uid-demo'; // - reemplaza con el actual usuario si lo tienes
      await addDoc(this.horasRef, r);
    }
    this.registro = this.blankRegistro();
  }

  // Elimina
  async eliminarRegistro(id: string) {
    const ref = doc(this.firestore, `horas/${id}`);
    await deleteDoc(ref);
  }

  // Carga para edición
  editarRegistro(registro: TimeLogger) {
    this.editandoId = registro.id || null;
    this.registro = { ...registro }; // copia el registro
  }

  // Calcula estadísticas globales
  calculaStats(registros: TimeLogger[]) {
    this.ingresoTotal = registros.reduce((a, r) => a + r.ingreso, 0);
    this.horasTotales = registros.reduce((a, r) => a + r.horas, 0);
    this.promedioTarifa = this.horasTotales ? this.ingresoTotal / this.horasTotales : 0;
  }
}
