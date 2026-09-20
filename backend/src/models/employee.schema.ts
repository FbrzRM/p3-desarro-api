import { Schema, model, type InferSchemaType } from 'mongoose';

const employeeSchema = new Schema(
  {
    nombre: { type: String, required: true },
    cargo: { type: String, required: true },
    departamento: { type: String, required: true },
    sueldo: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type EmployeeDocument = InferSchemaType<typeof employeeSchema>;

export const EmployeeModel = model('Empleado', employeeSchema);
