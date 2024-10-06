import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestGuard } from './guard/request.guard';

@Controller()
@UseGuards(RequestGuard)
export class AppController {
  @Inject()
  private readonly appService: AppService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
