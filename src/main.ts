import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { UserSeed } from './user/seed/seed';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Documentação com Swagger - Whatsapp Messenger')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('doc-api', app, swaggerDocument);

  app.enableCors();

  const seederService = app.get(UserSeed);

  await seederService.seedAdminUser();

  await app.listen(PORT);
}
bootstrap();
