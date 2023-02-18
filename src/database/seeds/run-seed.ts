import { NestFactory } from '@nestjs/core';
import { ExampleSeedService } from './appointment/example-seed.service';
import { SeedModule } from './seed.module';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(ExampleSeedService).run();

  
  await app.close();
};

void runSeed();
