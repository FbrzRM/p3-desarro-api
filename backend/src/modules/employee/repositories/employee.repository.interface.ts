import type {
  IEmployee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from '../entities/employee.entity.js';

// Contrato (abstracción) del repositorio. El controlador depende de esta
// interfaz, NO de una implementación concreta (Mongoose). Esto permite
// inyectar un mock 100% aislado en las pruebas unitarias.
export interface IEmployeeRepository {
  findAll(): Promise<IEmployee[]>;
  findById(id: string): Promise<IEmployee | null>;
  create(data: CreateEmployeeInput): Promise<IEmployee>;
  update(id: string, data: UpdateEmployeeInput): Promise<IEmployee | null>;
  delete(id: string): Promise<boolean>;
}
