import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { V1Module } from './v1/v1.module';
import { TelemetryMiddleware } from './utils/interceptors/telemetry.middleware';

@Module({
  imports: [
    V1Module,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TelemetryMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
