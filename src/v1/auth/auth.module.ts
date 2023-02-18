import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminStrategy } from './strategies/admin.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from '../admin/admin.module';
import { OTTHistory } from './entities/ott-history.entity';
import { UserStrategy } from './strategies/user.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OTTHistory]),
    forwardRef(() => AdminModule),
    forwardRef(() => UserModule),
    PassportModule.register(
      {defaultStrategy:'admin'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.adminSecret'),
        signOptions: {
          expiresIn: configService.get('auth.expires'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminStrategy, UserStrategy, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}
