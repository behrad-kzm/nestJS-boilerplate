import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { User } from '../../user/entities/user.entity';
import { AppError } from '../../../utils/common/app-error';

type JwtPayload = Pick<User, 'id'> & { iat: number; exp: number };

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.userSecret'),
    });
  }

  public validate(payload: JwtPayload) {
    if (payload.id == undefined || payload.id == null) {
      throw AppError({
        status: HttpStatus.UNAUTHORIZED,
        messages: [{
          message: 'user.notAuthorized',
          identifier: 'user.notAuthorized',
        }],
      });
    }
    return payload;
  }
}
