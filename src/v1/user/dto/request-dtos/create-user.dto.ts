import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";
import { GENDER_ENUM } from "../../gender.enum";
import { Optional } from "@nestjs/common";

export class CreateUserDto {

    @ApiProperty({ enum: GENDER_ENUM })
    @IsNotEmpty()
    gender: GENDER_ENUM;

    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: '' })
    @Optional()
    middleName: string;

    @ApiProperty({ example: 'Doe' })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example:  "1995-11-11T00:00:00.000Z" })
    @IsNotEmpty()
    birthDate: Date;

    @ApiProperty({ example: 'example@example.com' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '+61432029215' })
    @IsOptional()
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    password?: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    ott?: string;
}
