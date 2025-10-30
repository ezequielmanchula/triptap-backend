import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  // Configuración de CORS
  const allowedOrigins = ['https://trip-tap.netlify.app'];

//  const allowedOrigins = process.env.CORS_ORIGIN
//    ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
//    : ['http://localhost:3000', 'http://localhost:5173']; // default para local

  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? allowedOrigins
      : allowedOrigins, // en local permitimos React en 3000 (CRA) y 5173 (Vite)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // 🚀 Swagger config
  const config = new DocumentBuilder()
    .setTitle('TripTap API')
    .setDescription('API documentation for TripTap backend')
    .setVersion('1.0')
    .addBearerAuth() // 👈 para soportar JWT en Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Puerto dinámico: Render inyecta process.env.PORT, en local usamos 4000
  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend running on port ${port} [${process.env.NODE_ENV || 'local'} mode]`);
}
bootstrap();
