import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { IAuthController } from '../interfaces/IAuthController';
import { TYPES } from '@/infrastructure/di/types';
import { ILoginUseCase } from '@/application/use-cases/auth/ILoginUseCase';
import { ISendOtpUseCase } from '@/application/use-cases/auth/ISendOtpUseCase';
import { IVerifyOtpUseCase } from '@/application/use-cases/auth/IVerifyOtpUseCase';
import { HTTP_STATUS } from '@/shared/constants/httpStatusCodes';
import { RESPONSE_MESSAGES } from '@/shared/constants/responseMessages';

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.ILoginUseCase) private loginUseCase: ILoginUseCase,
    @inject(TYPES.ISendOtpUseCase) private sendOtpUseCase: ISendOtpUseCase,
    @inject(TYPES.IVerifyOtpUseCase) private verifyOtpUseCase: IVerifyOtpUseCase
  ) {}

  sendOtp = async (req: Request, res: Response): Promise<void> => {
    await this.sendOtpUseCase.execute(req.body);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'OTP sent successfully to your email',
      data: {
        email: req.body.email,
      },
    });
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const user = await this.verifyOtpUseCase.execute(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: RESPONSE_MESSAGES.REGISTER_SUCCESS,
      data: {
        user,
        requiresLogin: true,
        message:
          'Registration completed successfully. Please login to continue.',
      },
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { user, accessToken, refreshToken } = await this.loginUseCase.execute(
      req.body
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: RESPONSE_MESSAGES.LOGIN_SUCCESS,
      data: {
        user,
      },
    });
  };

  logout = async (_req: Request, res: Response): Promise<void> => {

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: RESPONSE_MESSAGES.LOGOUT_SUCCESS,
    });
  };


  resendOtp = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await this.sendOtpUseCase.execute(req.body);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'OTP resent successfully to your email',
      data: {
        email,
        expiresIn: 300,
      },
    });
  };
}
