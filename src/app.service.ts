import { Injectable, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AppService {
  getHello(@Req() req: Request, @Res() res: Response) {
    res.send('<h1>This server is running</h1>');
  }
}
