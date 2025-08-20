import { UserDto } from '../user/userDto';

export interface AuthResponseDto {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}
