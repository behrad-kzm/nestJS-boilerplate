import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { CreateOTTDto } from './dto/create-ott.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { userInfoResponseDto } from '../user/dto/response-dtos/user.response.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @Post('dashboard/login')
  @HttpCode(HttpStatus.OK)
  public async adminLogin(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.adminLogin(loginDto);
  }
  
  @Post('dashboard/refreshToken')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.service.refreshAdminToken(refreshTokenDto);
  }

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  public async userLogin(@Body() loginDto: AuthEmailLoginDto) {
    const response = await this.service.userLogin(loginDto);
    return {
      token: response.token,
      refreshToken: response.refreshToken,
      user: userInfoResponseDto(response.user),
    }
  }
  
  @Post('user/refreshToken')
  @HttpCode(HttpStatus.OK)
  public async userRefreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const response = await this.service.refreshUserToken(refreshTokenDto);
    return {
      token: response.token,
      refreshToken: response.refreshToken,
      user: userInfoResponseDto(response.user),
    }
  }

  @Post('create-ott')
  @HttpCode(HttpStatus.OK)
  public async sendOTT(@Body() createOTTDto: CreateOTTDto) {
    const response = await this.service.createOTT(createOTTDto);
    return {
      ott: response,
    };
  }
}
