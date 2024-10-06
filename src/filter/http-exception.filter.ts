import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { getClientIp } from 'request-ip';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    const userAgent = request.headers['user-agent'];
    const { method, path } = request;
    const clientIp = getClientIp(request);

    const statusCode = exception.getStatus();
    const res = exception.getResponse() as Record<string, any>;

    this.logger.error(
      `错误信息: ${method}; Path: ${path}; IP: ${clientIp}; userAgent: ${userAgent}; ErrorMessage: ${exception.message || res?.message}`,
    );

    response.status(statusCode).json({
      code: -1,
      statusCode,
      msg: 'request fail',
      errorMsg: exception.message || res?.message,
      timestamp: Date.now(),
    });
  }
}
