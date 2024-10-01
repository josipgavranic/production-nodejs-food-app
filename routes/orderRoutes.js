import express from 'express';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { createOrderController } from '../controllers/orderController.js';
import { getMyOrdersController } from '../controllers/orderController.js';
import { getOrderByIdController } from '../controllers/orderController.js';
import { paymentController } from '../controllers/orderController.js';
import { getAllOrdersController } from '../controllers/orderController.js';
import { updateOrderStatusController } from '../controllers/orderController.js';
// router object
const router = express.Router();

// ROUTES
// ============ ORDER ROUTES ============
// create order
router.post('/create', isAuth, createOrderController);
// get all orders
router.get('/my-orders', isAuth, getMyOrdersController);
// get order by id
router.get('/my-orders/:id', isAuth, getOrderByIdController);
// accept payment
router.post('/payments', isAuth, paymentController);
// get all orders
router.get('/admin/get-all-orders', isAuth, isAdmin, getAllOrdersController);
// get all orders
router.put('/admin/order/:id', isAuth, isAdmin, updateOrderStatusController);
// ======================================

// export
export default router;