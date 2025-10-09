import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private auth: Auth) {}

  //**
  // Registra el usuario,
  //  */
  registrar(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  //***
  // Obtiene los datos,
  // de ser correctos permite el acceso
  //  */
  ingresar(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  //***
  // Se conecta con
  // la autenticacion de googler,
  // para crear cuenta e ingresar
  //  */
  ingresarConGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  //***
  // Limpia los campos
  //  */
  salir() {
    return signOut(this.auth);
  }
}
