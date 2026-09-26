import { Request, Response } from 'express';
import { EmployeeController } from './employee.controller.js';
import { IEmployeeRepository } from '../repositories/employee.repository.interface.js';
import { IEmployee } from '../entities/employee.entity.js';

describe('🧪 Unit Test: EmployeeController (Mantenibilidad & Testabilidad)', () => {
  let controller: EmployeeController;
  let mockRepository: jest.Mocked<IEmployeeRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  // Empleado de ejemplo reutilizable en varias pruebas.
  const fakeEmployee: IEmployee = {
    _id: '507f1f77bcf86cd799439011',
    nombre: 'Andrés Mendoza',
    cargo: 'Arquitecto',
    departamento: 'TI',
    sueldo: 4000,
  };

  beforeEach(() => {
    // 1. Mock 100% aislado de la interfaz (Cero dependencia de Mongoose)
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    controller = new EmployeeController(mockRepository);

    // 2. Mockear los objetos del ciclo de vida de Express
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock };
    mockRequest = {};
  });

  // ────────────────────────────────────────────────────────────
  describe('getEmployees()', () => {
    it('Debería retornar 200 y la lista de empleados de la abstracción', async () => {
      const fakeEmployees = [fakeEmployee];
      mockRepository.findAll.mockResolvedValue(fakeEmployees);

      await controller.getEmployees(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(fakeEmployees);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('Debería retornar 200 y un arreglo vacío cuando no hay empleados', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      await controller.getEmployees(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([]);
    });
  });

  // ────────────────────────────────────────────────────────────
  describe('getEmployeeById()', () => {
    it('Debería retornar 200 y el empleado cuando existe', async () => {
      mockRepository.findById.mockResolvedValue(fakeEmployee);
      mockRequest = { params: { id: fakeEmployee._id } } as Partial<Request>;

      await controller.getEmployeeById(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findById).toHaveBeenCalledWith(fakeEmployee._id);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(fakeEmployee);
    });

    it('Debería retornar 404 cuando el empleado no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);
      mockRequest = { params: { id: 'no-existe' } } as Partial<Request>;

      await controller.getEmployeeById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Empleado no encontrado' });
    });
  });

  // ────────────────────────────────────────────────────────────
  describe('createEmployee()', () => {
    it('Debería retornar 201 y el empleado creado', async () => {
      const input = {
        nombre: 'Lucía Torres',
        cargo: 'Analista',
        departamento: 'Finanzas',
        sueldo: 3200,
      };
      const created = { _id: 'nuevo-id', ...input };
      mockRepository.create.mockResolvedValue(created);
      mockRequest = { body: input } as Partial<Request>;

      await controller.createEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(created);
    });
  });

  // ────────────────────────────────────────────────────────────
  describe('updateEmployee()', () => {
    it('Debería retornar 200 y el empleado actualizado cuando existe', async () => {
      const updated = { ...fakeEmployee, sueldo: 5000 };
      mockRepository.update.mockResolvedValue(updated);
      mockRequest = {
        params: { id: fakeEmployee._id },
        body: { sueldo: 5000 },
      } as Partial<Request>;

      await controller.updateEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.update).toHaveBeenCalledWith(fakeEmployee._id, { sueldo: 5000 });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updated);
    });

    it('Debería retornar 404 al actualizar un empleado inexistente', async () => {
      mockRepository.update.mockResolvedValue(null);
      mockRequest = { params: { id: 'no-existe' }, body: {} } as Partial<Request>;

      await controller.updateEmployee(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Empleado no encontrado' });
    });
  });

  // ────────────────────────────────────────────────────────────
  describe('deleteEmployee()', () => {
    it('Debería retornar 200 y mensaje de confirmación cuando se elimina', async () => {
      mockRepository.delete.mockResolvedValue(true);
      mockRequest = { params: { id: fakeEmployee._id } } as Partial<Request>;

      await controller.deleteEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.delete).toHaveBeenCalledWith(fakeEmployee._id);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Empleado eliminado' });
    });

    it('Debería retornar 404 al eliminar un empleado inexistente', async () => {
      mockRepository.delete.mockResolvedValue(false);
      mockRequest = { params: { id: 'no-existe' } } as Partial<Request>;

      await controller.deleteEmployee(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Empleado no encontrado' });
    });
  });
});
