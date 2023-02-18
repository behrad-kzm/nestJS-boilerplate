import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../../v1/config/app.config';
import databaseConfig from '../../v1/config/database.config';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { AppointmentSeedModule } from './appointment/example-seed.module';
import authConfig from '../../v1/config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, authConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    AppointmentSeedModule,
  ],
})
export class SeedModule {}
