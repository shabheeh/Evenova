import { Role } from "@/domain/entities/User";

export interface SendOtpDto {
  email: string;
  name: string;
  phone: string;
  location: string;
  password: string;
  roles: Role[];
}
