import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getStatusCode = (exception: unknown): number => {
  if (exception instanceof HttpException) {
    return exception.getStatus();
  } else if (exception instanceof BadRequestException) {
    return HttpStatus.BAD_REQUEST;
  } else {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
};

export const getErrorMessage = (exception: unknown): string => {
  return String((exception as Error).message);
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code = getStatusCode(exception);
    let message = getErrorMessage(exception);
    let exceptionThrown = exception;
    this.logger.error(`Error code: ${code}, message: ${message}, details: ${JSON.stringify(exception)} `, exceptionThrown);

    response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    response.status(code).json({
      status: `error`,
      error: message,
    });
  }
}
