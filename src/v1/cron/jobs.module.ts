import { Module } from '@nestjs/common';
import { CronService } from './services/cron.service';

@Module({
    imports: [
    ],
    controllers: [],
    providers: [CronService],
    exports: [CronService]
})
export class JobsModule { }