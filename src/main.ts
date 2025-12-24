import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor';

async function bootstrap() {
  const logger = new Logger(`Bootstrap: ${bootstrap.name}`);

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'log', 'debug', 'warn', 'verbose']
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nestjs-Post-API')
    .setDescription('api uses for implementing patterns')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
        in: "header",
      },
      "Bearer",
    )
    .addSecurityRequirements("Bearer")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV !== 'production')
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true
      }
    });

  app.useGlobalInterceptors(new LoggingInterceptor);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
