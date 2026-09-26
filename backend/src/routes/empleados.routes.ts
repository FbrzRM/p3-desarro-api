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

// Se registran las rutas en español (/empleados) y su alias en inglés
// (/employees) para el escenario de estrés de Artillery de la Fase B.
router.get(['/empleados', '/employees'], asyncHandler(controller.getEmpleados));

router.get(
  ['/empleados/:id', '/employees/:id'],
  validate({ params: employeeIdParamSchema }),
  asyncHandler(controller.getEmpleadoById),
);

router.post(
  ['/empleados', '/employees'],
  validate({ body: createEmployeeSchema }),
  asyncHandler(controller.addEmpleado),
);

router.put(
  ['/empleados/:id', '/employees/:id'],
  validate({ params: employeeIdParamSchema, body: updateEmployeeSchema }),
  asyncHandler(controller.updateEmpleado),
);

router.delete(
  ['/empleados/:id', '/employees/:id'],
  validate({ params: employeeIdParamSchema }),
  asyncHandler(controller.deleteEmpleado),
);

export default router;
