import type { Request, Response } from 'express';
import type { IEmployeeRepository } from '../repositories/employee.repository.interface.js';

// Controlador agnóstico a la base de datos: recibe la abstracción
// IEmployeeRepository por inyección de dependencias en el constructor.
export class EmployeeController {
  constructor(private readonly repository: IEmployeeRepository) {}

  getEmployees = async (_req: Request, res: Response): Promise<void> => {
    const employees = await this.repository.findAll();
    res.status(200).json(employees);
  };

  getEmployeeById = async (req: Request, res: Response): Promise<void> => {
    const employee = await this.repository.findById(req.params.id as string);
    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }
    res.status(200).json(employee);
  };

  createEmployee = async (req: Request, res: Response): Promise<void> => {
    const employee = await this.repository.create(req.body);
    res.status(201).json(employee);
  };

  updateEmployee = async (req: Request, res: Response): Promise<void> => {
    const employee = await this.repository.update(req.params.id as string, req.body);
    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }
    res.status(200).json(employee);
  };

  deleteEmployee = async (req: Request, res: Response): Promise<void> => {
    const deleted = await this.repository.delete(req.params.id as string);
    if (!deleted) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }
    res.status(200).json({ message: 'Empleado eliminado' });
  };
}
