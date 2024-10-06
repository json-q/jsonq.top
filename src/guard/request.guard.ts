import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestGuard implements CanActivate {
  private readonly logger = new Logger(RequestGuard.name);

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject()
  private readonly configService: ConfigService;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authKey = this.configService.get('CookieAccessKey');
    const configGithubId = this.configService.get('GithubID');
    const token = request.cookies[authKey];

    if (!token) {
      throw new UnauthorizedException('Null Authorized');
    }

    try {
      // const token = authorization.split(' ')[1];
      const verifyToken = this.jwtService.verify(token);
      if (verifyToken.id != configGithubId) {
        throw new ForbiddenException('Forbidden user');
      }

      return true;
    } catch (e) {
      this.logger.error(`RequestGuard Verify Failed: ${e.message}`);
      throw new UnauthorizedException('Authorized is not working');
    }
  }
}
