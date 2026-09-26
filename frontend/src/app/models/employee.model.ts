// Modelo de dominio del empleado (espejo del backend).
export interface Employee {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: string;
  updatedAt?: string;
}

// Payload usado al crear/editar (sin campos administrados por el servidor).
export interface EmployeeInput {
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
}

// Envoltura universal de respuestas del backend.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: ApiError[] | null;
  timestamp: string;
}

export interface ApiError {
  campo?: string;
  mensaje: string;
}
