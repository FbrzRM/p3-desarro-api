import { z } from 'zod';

export const createEmployeeSchema = z.object({
  nombre: z
    .string({ message: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  cargo: z
    .string({ message: 'El cargo es obligatorio' })
    .trim()
    .min(2, 'El cargo debe tener al menos 2 caracteres'),
  departamento: z
    .string({ message: 'El departamento es obligatorio' })
    .trim()
    .min(2, 'El departamento debe tener al menos 2 caracteres'),
  sueldo: z
    .number({ message: 'El sueldo debe ser numérico' })
    .positive('El sueldo debe ser un valor positivo'),
});

export const updateEmployeeSchema = createEmployeeSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar',
  });

export const employeeIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'El id no es un identificador válido'),
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
