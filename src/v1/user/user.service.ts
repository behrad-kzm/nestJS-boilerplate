import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {  Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { AuthService } from "../auth/auth.service";
import { CreateUserDto } from "./dto/request-dtos/create-user.dto";
import { OTT_TYPE_ENUM } from "../auth/enums/ott-types.enum";
import { AppError } from "../../utils/common/app-error";

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async createUser(userCreateDto: CreateUserDto) {
    
    const foundUser = await this.userRepository.count({
      where: [
        {
          email: userCreateDto.email,
        },
        {
          phone: userCreateDto.phone,
        }
      ]
    });

    await this.authService.verifyOTT({
      consumer: userCreateDto.phone,
      type: OTT_TYPE_ENUM.PHONE_VERIFICATION,
      token: userCreateDto.ott,
    });

    const user = await this.userRepository.save(
      this.userRepository.create({
        email: userCreateDto.email,
        password: userCreateDto.password,
        phone: userCreateDto.phone,
        phoneVerified: true,
      })
    );

    const userLogin = await this.authService.userLogin({
      email: userCreateDto.email,
      password: userCreateDto.password,
    });

    return userLogin;
  }


  async getUser({ userId, email }: { userId?: number, email?: string }) {
    const foundUser = await this.userRepository.findOne({
      where: {
        ...( userId ? { id: userId } : {}),
        ...( email ? { email } : {}),
      }
    });

    if (!foundUser) {
      throw AppError({
        status: HttpStatus.BAD_REQUEST,
        messages: [{
          message: 'user.emailNotFound',
          identifier: 'user.emailNotFound',
        }],
      });
    }

    return foundUser;
  }
}
