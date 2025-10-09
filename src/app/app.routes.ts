import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { TimeLoggerComponent } from './time-logger/time-logger.component';

export const routes: Routes = [
  {path: '', component: AuthComponent},
  {path: 'timeLogger', component: TimeLoggerComponent}
];
