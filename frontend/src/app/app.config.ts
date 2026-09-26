import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

// Configuración de la aplicación (standalone). Se registra HttpClient de forma
// global para que EmployeeService pueda inyectarlo.
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()],
};
