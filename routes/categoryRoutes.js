import express from 'express';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { createCategoryController } from '../controllers/categoryController.js';
import { updateCategoryController } from '../controllers/categoryController.js';
import { getAllCategoriesController } from '../controllers/categoryController.js';
import { deleteCategoryController } from '../controllers/categoryController.js';

// router object
const router = express.Router();

// ROUTES
// ============ CATEGORY ROUTES ============
// create category
router.post('/create', isAuth, isAdmin, createCategoryController);
// update category
router.put('/update/:id', isAuth, updateCategoryController);
// get all categories
router.get('/get-all', isAuth, isAdmin, getAllCategoriesController);
// get all categories
router.delete('/delete/:id', isAuth, isAdmin, deleteCategoryController);
// =========================================

// export
export default router;