/* eslint-disable security/detect-object-injection */
import axios from '../common/axios';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../common/logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    try {
      // await Logger.logResponseError({
      //   exception,
      //   isCritical: status >= 500,
      //   status,
      //   url: request.url,
      // });
    } catch (error) {
      // nothing to do!
    }

    const exceptionResponse = exception.getResponse() as object;
    response
      .status(status)
      .json({
        ...exceptionResponse,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
