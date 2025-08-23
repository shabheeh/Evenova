import { container } from '@/infrastructure/di/inversify.config';
import { Router } from 'express';
import { IAuthController } from '../interfaces/IAuthController';
import { TYPES } from '@/infrastructure/di/types';
import { catchAsync } from '../middlewares/errorHandler';
import { validateLogin, validateSendOtp, validateVerifyOtp } from '../validators/authValidators';

const router = Router();

const authController = container.get<IAuthController>(TYPES.IAuthController);

router.post('/send-otp', validateSendOtp, catchAsync(authController.sendOtp));
router.post('/verify-otp', validateVerifyOtp, catchAsync(authController.verifyOtp));
router.post('/resend-otp', validateSendOtp,  catchAsync(authController.resendOtp));

router.post('/login', validateLogin, catchAsync(authController.login));
router.post('/logout', catchAsync(authController.logout));

export { router as authRoutes }
