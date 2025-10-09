import { Injectable } from '@angular/core';
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
import { Colecciones } from '../../environments/coleccion';


@Injectable({ providedIn: 'root' })
export class TimeLoggerService {
  // Referencia tipada a la colección 'horas' en Firestore
  private horasRef: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.horasRef = collection(this.firestore, Colecciones.horas);
  }

  /**
   * Obtiene todos los registros de la colección como un Observable.
   */
  getRegistros(): Observable<TimeLogger[]> {
    return collectionData(this.horasRef, { idField: 'id' }) as Observable<TimeLogger[]>;
  }

  /**
   * Agrega un nuevo registro a Firestore.
   */
  agregarRegistro(registro: TimeLogger) {
    return addDoc(this.horasRef, registro as any);
  }

  /**
   * Actualiza un registro existente en Firestore dada su id.
   */
  actualizarRegistro(id: string, registro: TimeLogger) {
    const ref = doc(this.firestore, `${Colecciones.horas}/${id}`);
    return updateDoc(ref, registro as any);
  }

  /**
   * Elimina un registro de la colección en Firestore.
   */
  eliminarRegistro(id: string) {
    const ref = doc(this.firestore, `${Colecciones.horas}/${id}`);
    return deleteDoc(ref);
  }
}
