import { container } from '@/infrastructure/di/inversify.config';
import { Router } from 'express';
import { IAuthController } from '../interfaces/IAuthController';
import { TYPES } from '@/infrastructure/di/types';
import { catchAsync } from '../middlewares/errorHandler';
import { validateLogin, validateRegister } from '../validators/authValidators';

const router = Router();

const authController = container.get<IAuthController>(TYPES.IAuthController);

router.post('/login', validateLogin, catchAsync(authController.login));
router.post('/register', validateRegister, catchAsync(authController.register));
router.post('/logout', catchAsync(authController.logout));

export default router;
