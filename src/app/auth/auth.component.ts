import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, NgIf, AsyncPipe],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  //Propiedades para los campos
  email = '';
  password = '';

  registered = false;// Flag
  loginError: string | null = null;//Control de errores
  user$: Observable<User | null>;//Observable que obtiene el user

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);
  }

  //**
  // Registra el usuario,
  // con la opcion del "crear cuenta"
  //  */
  async registrar() {
    await createUserWithEmailAndPassword(this.auth, this.email, this.password);
    await signOut(this.auth);
    this.registered = true;
    this.password = '';
  }

  //***
  // Obtiene los datos,
  // de ser correctos permite el acceso
  // con la opcion de "ingresar"
  //  */
  async ingresar() {
    this.loginError = null;
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
    } catch (err: any) {
      this.loginError = "Credenciales Invalidas. Porfavor intentelo nuevamente";//COMEBACK: revisar como no hardcodear esto
    }
  }

  //***
  // Se conecta con
  // la autenticacion de googler,
  // para crear cuenta e ingresar
  //  */
  async ingresarConGoogle() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  //***
  // Limpia los campos
  // y cierra la sesion
  //  */
  async salir() {
    await signOut(this.auth);
    this.email = '';
    this.password = '';
  }


}
