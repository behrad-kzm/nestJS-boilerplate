import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
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

}
