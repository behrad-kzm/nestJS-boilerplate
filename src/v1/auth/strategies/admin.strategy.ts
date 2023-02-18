import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AdminUser } from '../../admin/entities/admin.entity';
import { ConfigService } from '@nestjs/config';
import { AppError } from '../../../utils/common/app-error';

type JwtPayload = Pick<AdminUser, 'id'> & { iat: number; exp: number };

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.adminSecret'),
    });
  }

  public validate(payload: JwtPayload) {
    if (payload.id == undefined || payload.id == null) {
      throw AppError({
        status: HttpStatus.UNAUTHORIZED,
        messages: [{
          message: 'admin.notAuthorized',
          identifier: 'admin.notAuthorized',
        }],
      });
    }
    return payload;
  }
}
