// Documento OpenAPI 3.0 para la API de Gestión de empleados.
// Se define a mano (sin escaneo por glob) para que funcione de forma fiable
// dentro del contenedor Docker con tsx.

const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API de Gestión de empleados',
    version: '1.0.0',
    description:
      'API REST para administrar empleados (CRUD). Construida con Express, TypeScript y MongoDB.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Servidor base de la API (versión 1)',
    },
  ],
  tags: [
    {
      name: 'Empleados',
      description: 'Operaciones sobre empleados',
    },
  ],
  components: {
    responses: {
      ValidacionError: {
        description: 'Datos de entrada inválidos',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiResponse' },
            example: {
              success: false,
              message: 'Error de validación',
              data: null,
              errors: [
                { campo: 'nombre', mensaje: 'El nombre debe tener al menos 3 caracteres' },
                { campo: 'sueldo', mensaje: 'El sueldo debe ser un valor positivo' },
              ],
              timestamp: '2026-09-20T12:00:00.000Z',
            },
          },
        },
      },
      NoEncontrado: {
        description: 'Empleado no encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiResponse' },
            example: {
              success: false,
              message: 'Empleado no encontrado',
              data: null,
              errors: null,
              timestamp: '2026-09-20T12:00:00.000Z',
            },
          },
        },
      },
    },
    schemas: {
      Empleado: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '652f1a2b3c4d5e6f7a8b9c0d' },
          nombre: { type: 'string', example: 'Juan Pérez' },
          cargo: { type: 'string', example: 'Desarrollador' },
          departamento: { type: 'string', example: 'Tecnología' },
          sueldo: { type: 'number', example: 1500.5 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      EmpleadoInput: {
        type: 'object',
        required: ['nombre', 'cargo', 'departamento', 'sueldo'],
        properties: {
          nombre: {
            type: 'string',
            minLength: 3,
            example: 'Juan Pérez',
            description: 'Nombre del empleado (mínimo 3 caracteres)',
          },
          cargo: {
            type: 'string',
            minLength: 2,
            example: 'Desarrollador',
            description: 'Cargo del empleado (mínimo 2 caracteres)',
          },
          departamento: {
            type: 'string',
            minLength: 2,
            example: 'Tecnología',
            description: 'Departamento del empleado (mínimo 2 caracteres)',
          },
          sueldo: {
            type: 'number',
            example: 1500.5,
            description: 'Sueldo del empleado (valor positivo)',
          },
        },
      },
      EmpleadoUpdate: {
        type: 'object',
        description: 'Al menos un campo debe enviarse para actualizar.',
        properties: {
          nombre: { type: 'string', minLength: 3, example: 'Juan Pérez' },
          cargo: { type: 'string', minLength: 2, example: 'Líder técnico' },
          departamento: { type: 'string', minLength: 2, example: 'Tecnología' },
          sueldo: { type: 'number', example: 2000 },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operación exitosa' },
          data: { nullable: true },
          errors: {
            nullable: true,
            type: 'array',
            items: {
              type: 'object',
              properties: {
                campo: { type: 'string' },
                mensaje: { type: 'string' },
              },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/empleados': {
      get: {
        tags: ['Empleados'],
        summary: 'Listar empleados',
        responses: {
          '200': {
            description: 'Lista de empleados obtenida',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Empleado' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Empleados'],
        summary: 'Crear empleado',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EmpleadoInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Empleado creado correctamente' },
          '400': { $ref: '#/components/responses/ValidacionError' },
        },
      },
    },
    '/empleados/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Identificador de MongoDB (ObjectId de 24 caracteres hex)',
          schema: { type: 'string', example: '652f1a2b3c4d5e6f7a8b9c0d' },
        },
      ],
      get: {
        tags: ['Empleados'],
        summary: 'Obtener empleado por id',
        responses: {
          '200': { description: 'Empleado encontrado' },
          '404': { $ref: '#/components/responses/NoEncontrado' },
        },
      },
      put: {
        tags: ['Empleados'],
        summary: 'Actualizar empleado',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EmpleadoUpdate' },
            },
          },
        },
        responses: {
          '200': { description: 'Empleado actualizado correctamente' },
          '400': { $ref: '#/components/responses/ValidacionError' },
          '404': { $ref: '#/components/responses/NoEncontrado' },
        },
      },
      delete: {
        tags: ['Empleados'],
        summary: 'Eliminar empleado',
        responses: {
          '200': { description: 'Empleado eliminado correctamente' },
          '404': { $ref: '#/components/responses/NoEncontrado' },
        },
      },
    },
  },
} as const;

export default openapiSpec;
