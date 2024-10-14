import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { getClientIp } from 'request-ip';

/**
 * @deprecated not use this middleware
 */
@Injectable()
export class IpMiddleware implements NestMiddleware {
  @Inject()
  private readonly configService: ConfigService;

  use(req: Request, res: Response, next: () => void) {
    // 允许的IP列表
    const allowedIps: string[] = ['::1', this.configService.get('ServerIP')];
    const clientIp = getClientIp(req);
    const exist = allowedIps.some((ip) => clientIp.indexOf(ip) > -1);

    if (!exist) throw new HttpException('Forbidden: Request not allowed', HttpStatus.FORBIDDEN);
    next();
  }
}
