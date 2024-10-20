import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CONTROL_AUTH } from '@/decorator/constants';

@Injectable()
export class RequestGuard implements CanActivate {
  private readonly logger = new Logger(RequestGuard.name);

  @Inject(Reflector)
  private reflector: Reflector;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject()
  private readonly configService: ConfigService;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // skip auth verify
    const metadata = this.reflector.get(CONTROL_AUTH, context.getHandler());
    if (metadata == 'public') return true;

    const accessKey = this.configService.get('cookie.accessKey');
    const githubUserId = this.configService.get('github.userId');
    const token = request.cookies[accessKey];

    if (!token) {
      throw new UnauthorizedException('Null Authorized');
    }

    try {
      // const token = authorization.split(' ')[1];
      const verifyToken = this.jwtService.verify(token);
      if (verifyToken.id != githubUserId) {
        throw new ForbiddenException('Forbidden user');
      }

      return true;
    } catch (e) {
      this.logger.error(`RequestGuard Verify Failed: ${e.message}`);
      throw new UnauthorizedException('Authorized is not working');
    }
  }
}
