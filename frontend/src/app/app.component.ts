import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeService } from './services/employee.service';
import { Employee, EmployeeInput } from './models/employee.model';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';

/**
 * [Reto 4] Componente INTELIGENTE (Smart / Orquestador).
 *
 * Consume los observables del servicio EXCLUSIVAMENTE con el pipe `async`
 * (cero `.subscribe()` en la plantilla) y coordina los componentes Dumb:
 * el formulario y la lista se comunican solo por @Input()/@Output().
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmployeeFormComponent, EmployeeListComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  // Streams expuestos a la plantilla mediante `async`.
  readonly employees$ = this.employeeService.employees$;
  readonly loading$ = this.employeeService.loading$;
  readonly error$ = this.employeeService.error$;

  // Empleado seleccionado para edición (null => modo crear).
  selected: Employee | null = null;

  constructor(private readonly employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.loadEmployees();
  }

  onSave(input: EmployeeInput): void {
    const request$ = this.selected
      ? this.employeeService.updateEmployee(this.selected.id, input)
      : this.employeeService.createEmployee(input);

    // Única suscripción permitida: en el Smart, para reaccionar al resultado.
    request$.subscribe({
      next: () => (this.selected = null),
      error: () => {
        /* el error ya se publica en error$ del servicio */
      },
    });
  }

  onEdit(employee: Employee): void {
    // Se pasa una copia para no compartir la referencia con la lista.
    this.selected = { ...employee };
  }

  onCancel(): void {
    this.selected = null;
  }

  onRemove(employee: Employee): void {
    if (!confirm(`¿Eliminar a "${employee.nombre}"?`)) {
      return;
    }
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        if (this.selected?.id === employee.id) {
          this.selected = null;
        }
      },
      error: () => {
        /* error manejado en error$ */
      },
    });
  }
}
