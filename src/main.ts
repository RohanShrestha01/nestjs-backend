import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  const config = new DocumentBuilder()
    .setTitle('Event Management System API')
    .setDescription('API for Event Management System')
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [] });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
