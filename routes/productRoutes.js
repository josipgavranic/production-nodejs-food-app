import express from 'express';
import { getAllProductsController } from '../controllers/productController.js';
import { getSingleProductController } from '../controllers/productController.js';
import { createProductController } from '../controllers/productController.js';
import { updateProductController } from '../controllers/productController.js';
import { updateProductImageController } from '../controllers/productController.js';
import { deleteProductImageController } from '../controllers/productController.js';
import { deleteProductController } from '../controllers/productController.js';
import { createProductReviewController } from '../controllers/productController.js';
import { getTopProductsController } from '../controllers/productController.js';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js';

// router object
const router = express.Router();

/// ROUTES
// =========== PRODUCT ROUTES ============
// get all products
router.get('/all', getAllProductsController);
// get top products
router.get('/top', getTopProductsController);
// get product by id
router.get('/:id', getSingleProductController);
// create product
router.post('/create', isAuth, isAdmin, singleUpload, createProductController);
// update product
router.put('/:id', isAuth, isAdmin, singleUpload, updateProductController);
// update product image
router.put('/image/:id', isAuth, isAdmin, singleUpload, updateProductImageController);
// delete product image
router.delete('/delete-image/:id', isAuth, isAdmin, deleteProductImageController);
// delete product
router.delete('/delete/:id', isAuth, isAdmin, deleteProductController);
// review product
router.put('/review/:id', isAuth, createProductReviewController);
// =====================================
// export
export default router;