import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAdminDto {
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsNotEmpty()
  password: string;
}
