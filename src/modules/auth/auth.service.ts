import { BadRequestException, Inject, Injectable, Req, Res, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Request, Response } from 'express';

const COOKIE_ACCESS_EXPIRE = 1000 * 60 * 30;
const COOKIE_REFRESH_EXPIRE = 1000 * 60 * 60 * 24 * 7;

const JWT_ACCESS_EXPIRE = '30m';
const JWT_REFRESH_EXPIRE = '7d';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  // secure: true,
  // sameSite: 'lax',
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  githubCallback(@Req() req, @Res() res: Response) {
    if (!req.user) {
      throw new BadRequestException('Invalid user');
    }

    const userInfo = {
      id: req.user.id,
      displayName: req.user.displayName,
      username: req.user.username,
      profileUrl: req.user.profileUrl,
      avatar: req.user._json.avatar_url,
    };

    const accessToken = this.jwtService.sign(userInfo, { expiresIn: JWT_ACCESS_EXPIRE });
    const refreshToken = this.jwtService.sign(userInfo, { expiresIn: JWT_REFRESH_EXPIRE });

    const userKey = this.configService.get('CookieUserKey');
    const accessKey = this.configService.get('CookieAccessKey');
    const refreshKey = this.configService.get('CookieRefreshKey');

    // No sensitive information , can be set for a long time
    res.cookie(userKey, JSON.stringify(userInfo), { maxAge: COOKIE_REFRESH_EXPIRE });
    res.cookie(accessKey, accessToken, { ...cookieOptions, maxAge: COOKIE_ACCESS_EXPIRE });
    res.cookie(refreshKey, refreshToken, { ...cookieOptions, maxAge: COOKIE_REFRESH_EXPIRE });
    res.redirect('/client');
  }
  @Inject()
  private readonly configService: ConfigService;

  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const userKey = this.configService.get('CookieUserKey');
    const accessKey = this.configService.get('CookieAccessKey');
    const refreshKey = this.configService.get('CookieRefreshKey');
    const refreshToken = req.cookies[refreshKey];

    if (!refreshToken) throw new UnauthorizedException('Null Refresh Authorized');

    try {
      const verifyRefreshToken = this.jwtService.verify(refreshToken);

      // 'iat' and 'exp' property is not needed, this is jwt auto added property
      if ('iat' in verifyRefreshToken) delete verifyRefreshToken.iat;
      if ('exp' in verifyRefreshToken) delete verifyRefreshToken.exp;

      const accessToken = this.jwtService.sign(verifyRefreshToken, { expiresIn: JWT_ACCESS_EXPIRE });
      const refershToken = this.jwtService.sign(verifyRefreshToken, { expiresIn: JWT_REFRESH_EXPIRE });

      res.cookie(userKey, JSON.stringify(verifyRefreshToken), { maxAge: COOKIE_REFRESH_EXPIRE });
      res.cookie(accessKey, accessToken, { ...cookieOptions, maxAge: COOKIE_ACCESS_EXPIRE });
      res.cookie(refreshKey, refershToken, { ...cookieOptions, maxAge: COOKIE_REFRESH_EXPIRE });
      res.status(200).send();
    } catch (e) {
      this.logger.error(`refreshAccessToken Verify Failed: ${e.message}`);
      throw new UnauthorizedException('Authorized is not working');
    }
  }
}
