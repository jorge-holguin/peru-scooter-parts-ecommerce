// backend/src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import passport from 'passport';
import { generateToken } from '../utils/generateToken';
import { protect } from '../middleware/authMiddleware';

const router = Router();

const FRONTEND_URL = process.env.REDIRECT_URI_FRONTEND || 'http://localhost:5173/auth-success';

router.get('/me', protect, getCurrentUser);

// Ruta para iniciar sesión con Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback de Google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Genera un token JWT
    const token = generateToken((req.user as any).id);

    // Redirige al frontend con el token como parámetro
    res.redirect(`${FRONTEND_URL}?token=${token}`);
  }
);

// Ruta para iniciar sesión con GitHub
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// Callback de GitHub
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    // Genera un token JWT
    const token = generateToken((req.user as any).id);

    // Redirige al frontend con el token como parámetro
    res.redirect(`${FRONTEND_URL}?token=${token}`);
  }
);

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

export default router;
