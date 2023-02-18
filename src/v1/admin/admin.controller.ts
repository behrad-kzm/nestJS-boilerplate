import { Controller, Get, HttpCode, Request, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AdminService } from "./admin.service";

@ApiBearerAuth()
@ApiTags('Dashboard Admin')
@Controller({
  version: '1',
})
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) { }

  @Get('admin/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('admin'))
  async getCurrentMember(@Request() request) {
    return this.adminService.getProfile(request.user.id);
  }

  @Get('admin/general-info')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('admin'))
  async getGeneralInfo() {
    return this.adminService.getGeneralInfo();
  }
}
