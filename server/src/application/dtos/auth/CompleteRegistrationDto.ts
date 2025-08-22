import { UserDto } from "../user/userDto";

export interface CompleteRegistrationResponseDto {
  success: boolean;
  message: string;
  data: {
    user: UserDto;
    requiresEmailVerification: boolean;
  };
}
