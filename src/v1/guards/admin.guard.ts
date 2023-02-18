import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {
    super();
  }
  async canActivate(
    context: ExecutionContext,
  ) {

    const request = context.switchToHttp().getRequest();
    
    try {
      const admin = await this.adminService.findOne({
        id: request.user?.id
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
