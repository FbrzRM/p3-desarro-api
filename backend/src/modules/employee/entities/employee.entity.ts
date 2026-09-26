// Entidad de dominio del módulo Employee.
// NO depende de Mongoose: es una abstracción pura para garantizar la
// testabilidad y la modularidad (Mantenibilidad).
export interface IEmployee {
  _id?: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
}

export type CreateEmployeeInput = Omit<IEmployee, '_id'>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
