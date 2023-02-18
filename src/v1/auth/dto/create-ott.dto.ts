import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty } from "class-validator";
import { OTT_TYPE_ENUM } from "../enums/ott-types.enum";

export class CreateOTTDto {
  @ApiProperty({ example: '+64123456789' })
  @IsNotEmpty()
  consumer: string;

  @ApiProperty({ enum: OTT_TYPE_ENUM, examples: Object.values(OTT_TYPE_ENUM) })
  @IsNotEmpty()
  @IsIn(Object.values(OTT_TYPE_ENUM))
  type: OTT_TYPE_ENUM;
}

