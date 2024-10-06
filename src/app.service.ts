import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  @Inject()
  private readonly configService: ConfigService;
  getHello(): string {
    return 'Hello World!-----' + JSON.stringify(this.configService.get('AccessKeyID'));
  }
}
