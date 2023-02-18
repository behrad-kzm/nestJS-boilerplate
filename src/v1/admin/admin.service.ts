import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { AppError } from '../../utils/common/app-error';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { SUPPORTED_TIME_ZONES } from '../../utils/common/timezone.enum';

@Injectable()
export class AdminService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(AdminUser)
    private adminUserRepository: Repository<AdminUser>,
  ) { }

  async findOne(fields: EntityCondition<AdminUser>) {
    const admin = await this.adminUserRepository.findOne({
      where: fields,
    });
    if (!admin) {
      throw AppError({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        messages: [{
          message: 'admin.emailNotFound',
          identifier: 'admin.emailNotFound',
        }],
      });
    }
    return admin;
  }

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return this.adminUserRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  getGeneralInfo() {
    return {
      timesZones: [
        { value: SUPPORTED_TIME_ZONES.AMERICA_PEURTO_RICO, name: "Puerto Rico (Atlantic)" },
        { value: SUPPORTED_TIME_ZONES.AMERICA_NEW_YORK, name: "New York (Eastern)" },
        { value: SUPPORTED_TIME_ZONES.AMERICA_CHICAGO, name: "Chicago (Central)" },
        { value: SUPPORTED_TIME_ZONES.AMERICA_DENVER, name: "Denver (Mountain)" },
        { value: SUPPORTED_TIME_ZONES.AMERICA_PHOENIX, name: "Phoenix (MST)" },
        { value: SUPPORTED_TIME_ZONES.AMERICA_LOS_ANGELES, name: "Los Angeles (Pacific)" },
        { value: SUPPORTED_TIME_ZONES.AMERICA_ANCHORAGE, name: "Anchorage (Alaska)" },
        { value: SUPPORTED_TIME_ZONES.AMERICA_HONOLULU, name: "Honolulu (Hawaii)" }
      ],
    }
  }

  async getProfile(adminId: number) {
      const adminUser = await this.adminUserRepository
      .findOne({
        where: {
          id: adminId,
        },
      });
      
      return {
        email: adminUser.email,
      }
  }
}
