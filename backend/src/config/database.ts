import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const MONGO_URI =
    process.env.MONGO_URI ?? 'mongodb://127.0.0.1/usuarios_db';
  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 50, // más conexiones concurrentes durante el pico de carga
      serverSelectionTimeoutMS: 5000,
    });
    console.log('🔄 [Database]: Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('❌ Error crítico al conectar a la base de datos:', error);
    process.exit(1);
  }
};