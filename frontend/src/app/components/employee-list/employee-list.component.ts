import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Employee } from '../../models/employee.model';

/**
 * [Reto 4] Componente PRESENTACIONAL (Dumb).
 *
 * Recibe la lista por @Input() y emite acciones (editar / eliminar) por
 * @Output(). No contiene lógica de negocio ni acceso a la API.
 */
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent {
  @Input() employees: Employee[] | null = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Employee>();
  @Output() remove = new EventEmitter<Employee>();

  trackById(_index: number, employee: Employee): string {
    return employee.id;
  }
}
