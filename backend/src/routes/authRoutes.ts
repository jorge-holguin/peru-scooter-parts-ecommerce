// backend/src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post(
    '/register',
    [
      body('name').notEmpty().withMessage('El nombre es obligatorio'),
      body('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
      body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    ],
    validateRequest,
    registerUser
  );

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Aquí puedes agregar rutas para OAuth con GitHub y Google en el futuro

export default router;
