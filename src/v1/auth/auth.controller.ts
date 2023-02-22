import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateOTTDto } from './dto/create-ott.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @Get('count')
  @HttpCode(HttpStatus.OK)
  public async count() {
    return this.service.count();
  }

  @Get('restCall')
  @HttpCode(HttpStatus.OK)
  public async rest() {
    return this.service.restRequest();
  }

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  public async sendOTT(@Body() createOTTDto: CreateOTTDto) {
    const response = await this.service.createOTT(createOTTDto);
    return {
      ott: response,
    };
  }
}
