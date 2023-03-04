import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AdminService } from '../admin/admin.service';
import { ConfigService } from '@nestjs/config';
import { CreateOTTDto } from './dto/create-ott.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OTTHistory } from './entities/ott-history.entity';
import { MoreThan, Repository } from 'typeorm';
import { generateRandomNumber } from '../../utils/common/generate-random-number';
import { VerifyOTTDto } from './dto/verify-ott.dto';
import { OTT_TYPE_ENUM } from './enums/ott-types.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserService } from '../user/user.service';
import { AppError } from '../../utils/common/app-error';
import { isPhoneNumber } from 'class-validator';
import axios from '../../utils/common/axios';
import * as opentelemetry from '@opentelemetry/sdk-node';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(OTTHistory)
    private ottRepository: Repository<OTTHistory>,
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) { }

  async count() {
    const res = await this.ottRepository.count({ });
    const key = opentelemetry.api.createContextKey("My-Custom-Context-Key");
    console.log("context value",opentelemetry.api.context.active().getValue(key));
    return res;
  }

  async restRequest(){
    const nextUrl = this.configService.get('app.nextServiceUrl');
    if (!nextUrl) {
      opentelemetry.api.trace.getActiveSpan().addEvent('FINISHED', {
        date: new Date().toISOString()
      })
      return {
        response: 'finished'
      }
    }
    try {
      console.log('THELOG', `${nextUrl}/api/v1/auth/restCall`)
      const res = await axios({
        method: 'get',
        url: `${nextUrl}/api/v1/auth/restCall`
      });
      return res.data;
    } catch (error)
    {
      console.log('YOOOOOOOOOO', error)
      return {
        err: error,
        
      }
    }
  }
  async adminLogin(loginDto: AuthEmailLoginDto): Promise<{ token: string; refreshToken: string; admin: { email: string; } }> {
   
    const admin = await this.adminService.findOne({
      email: loginDto.email,
    });

    if (!admin) {
      throw AppError({
        status: HttpStatus.BAD_REQUEST,
        messages: [{
          message: 'auth.incorrectPassword',
          identifier: 'auth.incorrectPassword',
        }],
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );
    
    if (isValidPassword) {
      const token = this.jwtService.sign({
        isAdmin: true,
        id: admin.id,
        // or more properties you want to include in jwt token
      }, {
        secret: this.configService.get('auth.adminSecret'),
        expiresIn: this.configService.get('auth.expires'),
      });

      const refreshToken = this.jwtService.sign({
        isAdmin: true,
        isRefreshToken: true,
        id: admin.id,
        // or more properties you want to include in jwt token
      }, {
        secret: this.configService.get('auth.adminSecret'),
        expiresIn: this.configService.get('auth.refreshTokenExpires'),
      });

      return {
        token,
        refreshToken,
        admin: admin
      };
    }
      throw AppError({
        status: HttpStatus.BAD_REQUEST,
        messages: [{
          message: 'auth.incorrectPassword',
          identifier: 'auth.incorrectPassword',
        }],
      });

  }

  async refreshAdminToken(refreshTokenDto: RefreshTokenDto): Promise<{ token: string; refreshToken: string; admin: { email: string; } }> {
    
    try {
      await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, { secret: this.configService.get('auth.adminSecret') });
    } catch (error) {
      throw AppError({
        status: HttpStatus.UNAUTHORIZED,
        messages: [{
          message: 'auth.invalidRefreshToken',
          identifier: 'auth.invalidRefreshToken',
        }],
      });
    }

    const decodedToken = this.jwtService.decode(refreshTokenDto.refreshToken) as any;
    if (
      !decodedToken ||
      !decodedToken.isRefreshToken ||
      !decodedToken.isAdmin
    ) {
      throw AppError({
        status: HttpStatus.UNAUTHORIZED,
        messages: [{
          message: 'auth.invalidRefreshToken',
          identifier: 'auth.invalidRefreshToken',
        }],
      });
    }

    const adminId = decodedToken.id;

    const admin = await this.adminService.findOne({
      id: adminId,
    });

    if (!admin) {
      throw AppError({
        status: HttpStatus.BAD_REQUEST,
        messages: [{
          message: 'auth.incorrectPassword',
          identifier: 'auth.incorrectPassword',
        }],
      });
    }

    const token = this.jwtService.sign({
      isAdmin: true,
      id: admin.id,
      // or more properties you want to include in jwt token
    }, {
      secret: this.configService.get('auth.adminSecret'),
      expiresIn: this.configService.get('auth.expires'),
    });

    const refreshToken = this.jwtService.sign({
      isAdmin: true,
      isRefreshToken: true,
      id: admin.id,
      // or more properties you want to include in jwt token
    }, {
      secret: this.configService.get('auth.adminSecret'),
      expiresIn: this.configService.get('auth.refreshTokenExpires'),
    });
    return {
      token,
      refreshToken,
      admin: admin
    };
  }

  async userLogin(loginDto: AuthEmailLoginDto) {

    const user = await this.userService.getUser({
      email: loginDto.email,
    });

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (isValidPassword) {
      const token = this.jwtService.sign({
        id: user.id,
      }, {
        secret: this.configService.get('auth.userSecret'),
        expiresIn: this.configService.get('auth.expires'),
      });

      const refreshToken = this.jwtService.sign({
        isRefreshToken: true,
        id: user.id,
      }, {
        secret: this.configService.get('auth.userSecret'),
        expiresIn: this.configService.get('auth.refreshTokenExpires'),
      });

      return { token, refreshToken, user };
    } else {
      throw AppError({
        status: HttpStatus.BAD_REQUEST,
        messages: [{
          message: 'auth.incorrectPassword',
          identifier: 'auth.incorrectPassword',
        }],
      });
    }
  }

  async refreshUserToken(refreshTokenDto: RefreshTokenDto) {
    try {
      await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, { secret: this.configService.get('auth.userSecret') });
    } catch (error) {
      throw AppError({
        status: HttpStatus.UNAUTHORIZED,
        messages: [{
          message: 'auth.invalidRefreshToken',
          identifier: 'auth.invalidRefreshToken',
        }],
      });
    }
    
    const decodedToken = this.jwtService.decode(refreshTokenDto.refreshToken) as any;
    if (
      !decodedToken ||
      !decodedToken.isRefreshToken
    ) {
      throw AppError({
        status: HttpStatus.UNAUTHORIZED,
        messages: [{
          message: 'auth.invalidRefreshToken',
          identifier: 'auth.invalidRefreshToken',
        }],
      });
    }
    const userId = decodedToken.id;
    const user = await this.userService.getUser({ userId })

    const token = this.jwtService.sign({
      id: user.id,
    }, {
      secret: this.configService.get('auth.userSecret'),
      expiresIn: this.configService.get('auth.expires'),
    });

    const refreshToken = this.jwtService.sign({
      isRefreshToken: true,
      id: user.id,
    }, {
      secret: this.configService.get('auth.userSecret'),
      expiresIn: this.configService.get('auth.refreshTokenExpires'),
    });
    return {
      token,
      refreshToken,
      user,
    };
  }

  async createOTT(createOttDto: CreateOTTDto) {
    const foundOtt = await this.ottRepository.findOne({
      where: {
        consumer: createOttDto.consumer,
        type: createOttDto.type,
        isUsed: false,
        expireAt: MoreThan(new Date()),
      }
    });
    if (foundOtt) {
      return foundOtt.token;
    }
    let expirationInMinutes = this.configService.get('auth.ottExpireDurationMinutes');

    if (createOttDto.type === OTT_TYPE_ENUM.PHONE_VERIFICATION && !isPhoneNumber(createOttDto.consumer)) {
      throw AppError({
        status: HttpStatus.BAD_REQUEST,
        messages: [{
          message: 'auth.phoneNumberNotValid',
          identifier: 'auth.phoneNumberNotValid'
        }],
      });
    }

    const newOtt = await this.ottRepository.save(
      this.ottRepository.create({
        consumer: createOttDto.consumer,
        type: createOttDto.type,
        expireAt: new Date(new Date().getTime() + expirationInMinutes * 60000),
        token: generateRandomNumber(this.configService.get('auth.ottDigitsCount')),
      })
    );
    return newOtt.token;
  }

  async verifyOTT(verifyOttDto: VerifyOTTDto): Promise<boolean> {
    const foundOtt = await this.ottRepository.findOne({
      where: {
        consumer: verifyOttDto.consumer,
        type: verifyOttDto.type,
        isUsed: false,
        expireAt: MoreThan(new Date()),
      }
    });
    if (!foundOtt || foundOtt.token !== verifyOttDto.token) {
      return false;
    }
    await this.ottRepository.update({
      id: foundOtt.id
    }, {
      isUsed: true
    });
    return true;
  }
}
