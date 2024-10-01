import exporess from 'express';
import { registerController } from '../controllers/userController.js';
import { loginController } from '../controllers/userController.js';
import { logoutController } from '../controllers/userController.js';
import { getUserProfileController } from '../controllers/userController.js';
import { updateProfileController } from '../controllers/userController.js';
import { updatePasswordController } from '../controllers/userController.js';
import { updateProfilePictureController } from '../controllers/userController.js';
import { resetPasswordController } from '../controllers/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js';
import { rateLimit } from 'express-rate-limit'

// rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})
// router object
const router = exporess.Router();

/// ROUTES
// =========== USER ROUTES ============
// register
router.post('/register', limiter, registerController);
// login
router.post('/login', limiter, loginController);
// logout
router.post('/logout', isAuth, logoutController);
// profile
router.get('/profile', isAuth, getUserProfileController)
// update-profile
router.put('/update-profile', isAuth, updateProfileController);
// update-password
router.put('/update-password', isAuth, updatePasswordController);
// update profile-picture
router.put('/update-profile-picture', isAuth, singleUpload, updateProfilePictureController);
// reset password
router.put('/reset-password', resetPasswordController);
// =====================================
// export
export default router;