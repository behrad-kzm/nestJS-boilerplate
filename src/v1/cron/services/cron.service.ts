import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class CronService {

  constructor(
    private schedulerRegistry: SchedulerRegistry,
  ) { }

  @Cron('0 */5 * * * *')
  async runEveryMinutes() {
    console.log("runEveryMinutes...", new Date());
  }
}
