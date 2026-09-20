import app from './app.js';
import { connectDatabase } from './config/database.js';

const port = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  await connectDatabase();
  app.listen(port, () => {
    console.log('Servidor escuchando en el puerto ' + port);
  });
};

startServer();
