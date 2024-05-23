import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { UserSeed } from './user/seed/seed';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

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
bootstrap().then(() => console.log(`Aplicação executando na porta ${PORT}`));
