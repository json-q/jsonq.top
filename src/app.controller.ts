import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Inject()
  private readonly appService: AppService;

  @Get()
  getHello(@Req() req, @Res() res: Response) {
    this.appService.getHello(req, res);
  }
}
