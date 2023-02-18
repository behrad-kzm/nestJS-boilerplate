import { User } from "../../entities/user.entity";

export function userInfoResponseDto(rawValue: User){
  return {
    id: String(rawValue.id),
    email: rawValue.email,
    emailVerified: rawValue.emailVerified,
    phone: rawValue.phone,
    phoneVerified: rawValue.phoneVerified,
  };
}