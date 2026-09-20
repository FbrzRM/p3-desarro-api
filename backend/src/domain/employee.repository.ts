import type {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from './employee.entity.js';

export interface IEmployeeRepository {
  findAll(): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  create(data: CreateEmployeeInput): Promise<Employee>;
  update(id: string, data: UpdateEmployeeInput): Promise<Employee | null>;
  delete(id: string): Promise<boolean>;
}
