import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('AWS S3 Upload API')
    .setDescription('API documentation for uploading images to AWS S3')
    .setVersion('1.0')
    .addTag('upload', 'Image upload endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
