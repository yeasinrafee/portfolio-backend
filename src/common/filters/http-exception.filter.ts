/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '../../generated/prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.resolveError(exception);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} — ${message}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} — ${message}`);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private resolveError(exception: unknown): {
    status: number;
    message: string | string[];
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message =
        typeof response === 'string' ? response : (response as any).message;
      return { status: exception.getStatus(), message };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.mapPrismaKnownError(exception);
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid data provided to the database query',
      };
    }

    // Prisma DB connection/initialization error
    if (exception instanceof Prisma.PrismaClientInitializationError) {
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Database connection failed',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  private mapPrismaKnownError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): { status: number; message: string } {
    switch (exception.code) {
      case 'P2002': {
        const target =
          (exception.meta?.target as string[])?.join(', ') ?? 'field';
        return {
          status: HttpStatus.CONFLICT,
          message: `A record with this ${target} already exists`,
        };
      }
      case 'P2025':
        return { status: HttpStatus.NOT_FOUND, message: 'Record not found' };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid reference — related record does not exist',
        };
      case 'P2014':
        return {
          status: HttpStatus.BAD_REQUEST,
          message:
            'Invalid relation — this change would violate a required relation',
        };
      default:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Database request error',
        };
    }
  }
}
