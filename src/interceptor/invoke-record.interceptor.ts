import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Response, Request } from 'express';
import { Observable, tap } from 'rxjs';
import { getClientIp } from 'request-ip';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const userAgent = request.headers['user-agent'];

    const { method, path } = request;
    const clientIp = getClientIp(request);

    this.logger.verbose(
      `请求信息: ${method}; Path: ${path}; IP: ${clientIp}; userAgent: ${userAgent}; Class: ${context.getClass().name}; Handler: ${context.getHandler().name}`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.logger.verbose(`请求用时: ${response.statusCode}: ${Date.now() - now}ms`);
        this.logger.verbose(`请求结果: ${JSON.stringify(res)}`);
      }),
    );
  }
}
