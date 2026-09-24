import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Permite que frontend (Next.js) e admin (Vite) consumam a API em portas diferentes
  const allowedOrigins = (
    process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:5173'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Configure Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Abrigo Lambeijos API')
    .setDescription('API para plataforma de adoção de animais')
    .setVersion('1.0.0')
    .addTag('Pets', 'Operações com animais')
    .addTag('Users', 'Operações com usuários')
    .addTag('Adopters', 'Operações com adotadores')
    .addTag('Adoptions', 'Operações com adoções')
    .addTag('Rescues', 'Operações com resgates')
    .addTag('Donations', 'Operações com doações')
    .addTag('Recommendations', 'Operações com recomendações')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
void bootstrap();
