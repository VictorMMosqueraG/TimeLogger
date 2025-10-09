//**
// Modelo para el registro de horas,
// cada campo es el que pide en
// firebase
//  */
export interface TimeLogger {
  id?: string;
  cliente: string;
  proyecto: string;
  fecha: string;
  horas: number;
  tarifaHora: number;
  ingreso: number;
  uid: string;
}
