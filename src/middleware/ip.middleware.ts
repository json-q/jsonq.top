import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';
import { getClientIp } from 'request-ip';

/**
 * @deprecated not use this middleware
 */
@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const allowedIps: string[] = ['::1'];
    const clientIp = getClientIp(req);
    const exist = allowedIps.some((ip) => clientIp.indexOf(ip) > -1);

    if (!exist) throw new HttpException('Forbidden: Request not allowed', HttpStatus.FORBIDDEN);
    next();
  }
}
