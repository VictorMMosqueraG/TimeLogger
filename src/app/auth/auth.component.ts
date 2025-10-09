import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Auth,
  authState,
  User,
} from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Messages } from '../commonds/message';
import { AppRoutes } from '../commonds/appRoutes';
import { AuthService } from '../services/auth.service';
import { AuthCredentials } from '../models/Auth.Model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, NgIf, AsyncPipe],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  //Propiedades para los campos
  credentials: AuthCredentials = { email: '', password: '' };

  registered = false;// Flag
  loginError: string | null = null;//Control de errores
  user$: Observable<User | null>;//Observable que obtiene el user

  constructor(
    private auth: Auth,
    private router: Router,
    private authService: AuthService
  ) {
    this.user$ = authState(this.auth);
  }

  //**
  // Registra el usuario,
  // con la opcion del "crear cuenta"
  //  */
  async registrar() {
    await this.authService.registrar(
      this.credentials.email ,
      this.credentials.password);

    await this.salir();// Cierra sesion

    //setea values
    this.registered = true;
    this.credentials.password = '';
  }

  //***
  // Obtiene los datos,
  // de ser correctos permite el acceso
  // con la opcion de "ingresar"
  //  */
  async ingresar() {
    this.loginError = null;
    try {
      await this.authService.ingresar(
        this.credentials.email ,
        this.credentials.password);

      this.router
        .navigate([AppRoutes.TIME_LOGGER]);
    } catch (err: any) {
      this.loginError =
        Messages.INVALID_CREDENTIALS;//COMEBACK: revisar como no hardcodear esto
    }
  }

  //***
  // Se conecta con
  // la autenticacion de googler,
  // para crear cuenta e ingresar
  //  */
  async ingresarConGoogle() {
    await this.authService.ingresarConGoogle();
    this.router.navigate([AppRoutes.TIME_LOGGER]);
  }

  //***
  // Limpia los campos
  // y cierra la sesion
  //  */
  async salir() {
    await this.authService.salir();//cierra sesion

    //Seta values
    this.credentials.email = '',
    this.credentials.password  = ''
  }


}
