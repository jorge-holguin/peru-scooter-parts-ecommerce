// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import passportConfig from './config/passport';
import path from 'path';

// Importar configuraciones y rutas
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import orderRoutes from './routes/orderRoutes';
import chatRoutes from './routes/chatRoutes';
import paymentRoutes from './routes/paymentRoutes';
import webhookRoutes from './routes/webhookRoutes';

// Configurar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar la aplicación Express
const app = express();

// Middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON en las solicitudes
app.use(morgan('dev')); // Registro de solicitudes HTTP

// Configurar sesiones (necesario para Passport.js)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
  })
);

// Inicializar Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configurar Passport.js
passportConfig(passport);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', webhookRoutes); // Endpoint del webhook
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);

// Servir archivos estáticos del frontend
const buildPath = path.resolve(__dirname, '../../frontend/build'); // Asegúrate de que apunte a la carpeta `build`
console.log(`Serving static files from: ${buildPath}`);
app.use(express.static(buildPath));

// Redirigir todas las rutas a `index.html` del frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Middleware para manejar errores 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejar errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Error en el servidor',
    error: err.message || 'Error desconocido',
  });
});

export default app;
