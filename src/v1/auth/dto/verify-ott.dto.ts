import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { OTT_TYPE_ENUM } from "../enums/ott-types.enum";

export class VerifyOTTDto {
  @ApiProperty({ example: '+64123456789' })
  @IsNotEmpty()
  consumer: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: OTT_TYPE_ENUM.PHONE_VERIFICATION })
  @IsNotEmpty()
  type: OTT_TYPE_ENUM;
}

