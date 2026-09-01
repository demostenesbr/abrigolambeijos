import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
bootstrap();
