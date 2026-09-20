import type { Request, Response } from 'express';
import type { IEmployeeRepository } from '../domain/employee.repository.js';
import { successResponse } from '../utils/api-response.js';
import { AppError } from '../utils/app-error.js';

export class EmpleadoController {
  constructor(private readonly repository: IEmployeeRepository) {}

  // LISTAR LOS EMPLEADOS
  getEmpleados = async (_req: Request, res: Response): Promise<void> => {
    const empleados = await this.repository.findAll();
    res.status(200).json(successResponse(empleados, 'Lista de empleados obtenida'));
  };

  // VER EMPLEADO
  getEmpleadoById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const empleado = await this.repository.findById(id as string);
    if (!empleado) {
      throw new AppError(404, 'Empleado no encontrado');
    }
    res.status(200).json(successResponse(empleado, 'Empleado encontrado'));
  };

  // CREACIÓN
  addEmpleado = async (req: Request, res: Response): Promise<void> => {
    const empleado = await this.repository.create(req.body);
    res.status(201).json(successResponse(empleado, 'Empleado creado correctamente'));
  };

  // ACTUALIZAR DATOS EMPLEADO
  updateEmpleado = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const empleado = await this.repository.update(id as string, req.body);
    if (!empleado) {
      throw new AppError(404, 'Empleado no encontrado');
    }
    res.status(200).json(successResponse(empleado, 'Empleado actualizado correctamente'));
  };

  // ELIMINAR EMPLEADO
  deleteEmpleado = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const eliminado = await this.repository.delete(id as string);
    if (!eliminado) {
      throw new AppError(404, 'Empleado no encontrado');
    }
    res.status(200).json(successResponse(null, 'Empleado eliminado correctamente'));
  };
}
