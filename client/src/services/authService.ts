import { api } from "@/lib/api";
import type {
  LoginFormData,
  RegisterFormData,
  VerifyOtpData,
} from "@/types/auth.types";

export const registerUser = async (data: RegisterFormData) => {
  try {
    const response = await api.post("/auth/send-otp", data);
    return response.data;
  } catch (error) {
    const err = error as Error;
    throw err;
  }
};

export const verifyOtp = async (data: VerifyOtpData) => {
  try {
    const response = await api.post("/auth/verify-otp", data);
    return response.data;
  } catch (error) {
    const err = error as Error;
    throw err;
  }
};

export const loginUser = async (data: LoginFormData) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    const err = error as Error;
    throw err;
  }
};
