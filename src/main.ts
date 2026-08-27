/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

const logger = new Logger('Bootstrap');
process.on('unhandledRejection', (reason) => {
  logger.error(
    'Unhandled Promise Rejection:',
    reason instanceof Error ? reason.stack : String(reason),
  );
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error.stack);
});

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    const configService = app.get(ConfigService);

    app.use(helmet());
    app.use(compression());
    app.enableCors({
      origin: configService.get<string[]>('cors.origin'),
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    app.useGlobalFilters(new AllExceptionsFilter());
    app.setGlobalPrefix('api/v1');
    app.enableShutdownHooks();

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Portfolio API')
      .setDescription(
        'Backend API for the fully dynamic portfolio website with admin dashboard.',
      )
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);

    const port = configService.get<number>('port') ?? 3000;
    await app.listen(port);
    logger.log(`Application running on: http://localhost:${port}/api/v1`);
    logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
  } catch (error) {
    logger.error(
      'Failed to start application',
      error instanceof Error ? error.stack : String(error),
    );
    process.exit(1);
  }
}

bootstrap();
