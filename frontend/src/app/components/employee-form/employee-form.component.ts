import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { Employee, EmployeeInput } from '../../models/employee.model';

/**
 * [Reto 4] Componente PRESENTACIONAL (Dumb).
 *
 * No conoce el servicio ni HttpClient. Recibe el empleado a editar por @Input()
 * y emite el resultado por @Output(). El @Input() se CLONA en un modelo local
 * para no mutar el objeto del padre (inmutabilidad del formulario).
 */
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.component.html',
})
export class EmployeeFormComponent implements OnChanges {
  /** Empleado en edición; null => modo "crear". */
  @Input() employee: Employee | null = null;
  /** Deshabilita el formulario mientras hay una operación en curso. */
  @Input() disabled = false;

  @Output() save = new EventEmitter<EmployeeInput>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('f') private form?: NgForm;

  // Modelo local (clon), nunca se muta el @Input directamente.
  model: EmployeeInput = this.emptyModel();

  get isEditing(): boolean {
    return this.employee !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee']) {
      this.model = this.employee
        ? {
            nombre: this.employee.nombre,
            cargo: this.employee.cargo,
            departamento: this.employee.departamento,
            sueldo: this.employee.sueldo,
          }
        : this.emptyModel();

      // Al cambiar el empleado (p. ej. tras guardar una edición y volver a modo
      // "crear"), se reinicia el estado touched/dirty para no arrastrar errores
      // de validación. Se difiere para que el nuevo modelo ya esté enlazado.
      queueMicrotask(() => this.form?.resetForm(this.model));
    }
  }

  onSubmit(form: NgForm): void {
    // Se emite una copia para evitar referencias compartidas con el padre.
    this.save.emit({ ...this.model });
    if (!this.isEditing) {
      // resetForm limpia también el estado touched/dirty, evitando que
      // se muestren errores de validación sobre los campos ya vaciados.
      this.model = this.emptyModel();
      form.resetForm(this.model);
    }
  }

  onCancel(): void {
    this.model = this.emptyModel();
    this.cancel.emit();
  }

  private emptyModel(): EmployeeInput {
    return { nombre: '', cargo: '', departamento: '', sueldo: 0 };
  }
}
