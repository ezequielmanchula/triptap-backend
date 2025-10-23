import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  // Habilitar CORS para frontend local (ajusta origin según tu frontend)
    // Habilitar CORS: leer desde la variable de entorno CORS_ORIGIN (coma-separada)
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
      : ['http://localhost:3000', 'http://localhost:3001'];

    app.enableCors({
      // aceptar peticiones desde los orígenes permitidos en desarrollo
      origin: (origin, callback) => {
        // permitir peticiones sin origin (por ejemplo herramientas como curl o servidores)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
      },
      credentials: true,
    });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
