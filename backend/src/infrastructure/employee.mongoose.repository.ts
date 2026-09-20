import type { IEmployeeRepository } from '../domain/employee.repository.js';
import type {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from '../domain/employee.entity.js';
import { EmployeeModel } from '../models/employee.schema.js';

interface EmployeeLike {
  _id: unknown;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt: Date;
  updatedAt: Date;
}

export class MongooseEmployeeRepository implements IEmployeeRepository {
  private toEntity(doc: EmployeeLike): Employee {
    return {
      id: String(doc._id),
      nombre: doc.nombre,
      cargo: doc.cargo,
      departamento: doc.departamento,
      sueldo: doc.sueldo,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findAll(): Promise<Employee[]> {
    const docs = await EmployeeModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async create(data: CreateEmployeeInput): Promise<Employee> {
    const doc = await EmployeeModel.create(data);
    return this.toEntity(doc);
  }

  async update(id: string, data: UpdateEmployeeInput): Promise<Employee | null> {
    const doc = await EmployeeModel.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
    });
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const doc = await EmployeeModel.findByIdAndDelete(id);
    return doc !== null;
  }
}
