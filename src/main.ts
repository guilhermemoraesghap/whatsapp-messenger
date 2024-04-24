import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { UserSeed } from './user/seed/seed';

dotenv.config();

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const seederService = app.get(UserSeed);

  await seederService.seedAdminUser();

  await app.listen(PORT);
}
bootstrap();
