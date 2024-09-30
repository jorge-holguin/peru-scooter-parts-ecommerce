import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Obtener perfil de usuario
router.get('/profile', protect, getUserProfile);

// Actualizar perfil de usuario
router.put('/profile', protect, updateUserProfile);

export default router;
