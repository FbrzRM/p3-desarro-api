import { Router } from 'express';
import { EmpleadoController } from '../controllers/empleados.controllers.js';
import { MongooseEmployeeRepository } from '../infrastructure/employee.mongoose.repository.js';
import { validate } from '../middlewares/validate.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeIdParamSchema,
} from '../dtos/employee.dto.js';

const router = Router();

const repository = new MongooseEmployeeRepository();
const controller = new EmpleadoController(repository);

router.get('/empleados', asyncHandler(controller.getEmpleados));

router.get(
  '/empleados/:id',
  validate({ params: employeeIdParamSchema }),
  asyncHandler(controller.getEmpleadoById),
);

router.post(
  '/empleados',
  validate({ body: createEmployeeSchema }),
  asyncHandler(controller.addEmpleado),
);

router.put(
  '/empleados/:id',
  validate({ params: employeeIdParamSchema, body: updateEmployeeSchema }),
  asyncHandler(controller.updateEmpleado),
);

router.delete(
  '/empleados/:id',
  validate({ params: employeeIdParamSchema }),
  asyncHandler(controller.deleteEmpleado),
);

export default router;
