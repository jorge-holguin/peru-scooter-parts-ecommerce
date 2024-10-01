// src/config/database.ts
import mongoose from 'mongoose';

const connectDB = async () => {
  // Usa la variable de entorno o la URI local por defecto
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/peru-scooter-parts';

  // Define las opciones de conexión de mongoose usando la variable de entorno USE_SSL
  const connectionOptions: mongoose.ConnectOptions = {
    ssl: process.env.USE_SSL === 'true', // Habilita SSL solo si USE_SSL es 'true'
    tlsAllowInvalidCertificates: process.env.USE_SSL === 'true' ? true : undefined, // Permitir certificados no válidos si se usa SSL
  };

  try {
    const conn = await mongoose.connect(mongoURI, connectionOptions);
    console.log(`✅ MongoDB conectado correctamente: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error al conectar a MongoDB: ${error}`);
    process.exit(1); // Termina la ejecución con código de error
  }
};

export default connectDB;
