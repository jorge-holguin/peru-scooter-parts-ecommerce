import { Router } from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
} from '../controllers/orderController';

const router = Router();

// Crear un nuevo pedido
router.post('/', protect, addOrderItems);

// Obtener pedido por ID
router.get('/:id', protect, getOrderById);

// Actualizar pedido a pagado
router.put('/:id/pay', protect, updateOrderToPaid);

// Implementa más rutas según sea necesario

export default router;
