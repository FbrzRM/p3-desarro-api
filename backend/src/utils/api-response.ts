export interface ApiError {
  campo?: string;
  mensaje: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: ApiError[] | null;
  timestamp: string;
}

export const successResponse = <T>(
  data: T,
  message = 'Operación exitosa',
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  errors: null,
  timestamp: new Date().toISOString(),
});

export const errorResponse = (
  message: string,
  errors: ApiError[] | null = null,
): ApiResponse<null> => ({
  success: false,
  message,
  data: null,
  errors,
  timestamp: new Date().toISOString(),
});
