import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'business@example.com' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'string' })
  @IsNotEmpty()
  password: string;
}
