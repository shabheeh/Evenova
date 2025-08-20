import { inject, injectable } from 'inversify';
import { IAuthController } from '../interfaces/IAuthController';
import { TYPES } from '@/infrastructure/di/types';
import { ILoginUseCase } from '@/application/use-cases/auth/ILoginUseCase';
import { IRegisterUseCase } from '@/application/use-cases/auth/IRegisterUseCase';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '@/shared/constants/httpStatusCodes';
import { RESPONSE_MESSAGES } from '@/shared/constants/responseMessages';

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.ILoginUseCase) private loginUseCase: ILoginUseCase,
    @inject(TYPES.IRegisterUseCase) private registerUseCase: IRegisterUseCase
  ) {}

  login = async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await this.loginUseCase.execute(
      req.body
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: RESPONSE_MESSAGES.LOGIN_SUCCESS,
      data: { user },
    });
  };
  register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.registerUseCase.execute(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: RESPONSE_MESSAGES.REGISTER_SUCCESS,
      data: result,
    });
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: RESPONSE_MESSAGES.LOGOUT_SUCCESS,
    });
  };
}
