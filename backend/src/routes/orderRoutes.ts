import { Router } from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
} from '../controllers/orderController';

const router = Router();

// Crear un nuevo pedido
router.post('/', protect, addOrderItems);

// Obtener todas las órdenes del usuario autenticado
router.get('/', protect, getMyOrders);

// Obtener pedido por ID
router.get('/:id', protect, getOrderById);

// Actualizar pedido a pagado
router.put('/:id/pay', protect, updateOrderToPaid);

// Implementa más rutas según sea necesario

export default router;
