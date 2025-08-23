import { z } from "zod";
import type { User } from "./user.types";
import { LOCATIONS } from "@/constants/locations";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    email: z.string().email("Please enter a valid email").trim(),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
    location: z.enum(LOCATIONS, {
      error: "Please select a location",
    }),

    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("Please enter a valid email").trim(),
  password: z.string().min(1, "Password is required"),
});

export interface VerifyOtpData {
  otp: string;
  email: string;
}

export interface RegisterUserApiResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
}

export interface LoginUserApiResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export type LoginFormData = z.infer<typeof loginSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;
