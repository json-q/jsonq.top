import { Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('oauth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Get('login/github')
  @UseGuards(AuthGuard('github'))
  loginGithub() {}

  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  githubCallback(@Req() req, @Res() res: Response) {
    this.authService.githubCallback(req, res);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshAccessToken(req, res);
  }
}
