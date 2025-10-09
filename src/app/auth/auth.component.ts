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

  email = '';
  password = '';
  registered = false;
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);
  }

  async registrar() {
    await createUserWithEmailAndPassword(this.auth, this.email, this.password);
    await signOut(this.auth);
    this.registered = true;
    this.password = '';
  }

  async ingresar() {
    await signInWithEmailAndPassword(this.auth, this.email, this.password);
  }

  async ingresarConGoogle() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async salir() {
    await signOut(this.auth);
    this.email = '';
    this.password = '';
  }
}
