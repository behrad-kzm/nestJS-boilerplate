import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminUser } from './entities/admin.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
    forwardRef(() => AuthModule),
    PassportModule.register(
      { defaultStrategy: 'admin' })],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
  export class AdminModule {}
  