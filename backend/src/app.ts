import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import empleadosRoutes from './routes/empleados.routes.js';
import openapiSpec from './config/swagger.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.set('nombreApp', 'Gestión de empleados');

// Documento OpenAPI en formato JSON (útil para importar en Postman/Insomnia).
app.get('/api-docs.json', (_req, res) => {
  res.json(openapiSpec);
});

// Documentación interactiva de la API (Swagger UI).
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use('/api/v1', empleadosRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
