import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/request-dtos/create-user.dto';
import { UserService } from '../user.service';
import { userInfoResponseDto } from '../dto/response-dtos/user.response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ) {
    const response = await this.userService.createUser(createUserDto);
    return {
      token: response.token,
      refreshToken: response.refreshToken,
      user: userInfoResponseDto(response.user),
    }
  }

  @ApiBearerAuth()
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('user'))
  async getCurrentUser(
    @Request() request,
  ) {
    const response = await this.userService.getUser({
      userId: request.user.id,
    });
    return userInfoResponseDto(response);
  }
}
