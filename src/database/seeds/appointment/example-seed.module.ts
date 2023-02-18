import { Module, forwardRef } from '@nestjs/common';
import { ExampleSeedService } from './example-seed.service';
import { AuthModule } from '../../../v1/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  providers: [ExampleSeedService],
  exports: [ExampleSeedService],
})
export class AppointmentSeedModule {}
