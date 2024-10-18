import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as OSS from 'ali-oss';
import axios from 'axios';
import { RequestGuard } from '@/guard/request.guard';
import { UrlPipe } from '@/pipe/url.pipe';
import { Request } from 'express';
import { ControlAuth } from '@/decorator/control-auth.decorator';

@Controller('oss')
@UseGuards(RequestGuard)
export class OssController {
  private readonly client: OSS;
  constructor(private readonly configService: ConfigService) {
    this.client = new OSS({
      endpoint: this.configService.get('Endpoint'),
      region: this.configService.get('Region'),
      accessKeyId: this.configService.get('AccessKeyID'),
      accessKeySecret: this.configService.get('AccessKeySecret'),
      bucket: this.configService.get('Bucket'),
      secure: true,
      cname: true,
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const filename = this.formatPathTime(file.originalname);
    try {
      const res = await this.client.put(filename, file.buffer);
      return {
        url: res.url,
        name: file.originalname,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  private formatPathTime(originalname: string, date = new Date()) {
    const dest = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    const pathTime = `${hours}${minutes}${seconds}${milliseconds}`;
    return dest + '/' + pathTime + '_' + originalname;
  }

  @Get('url')
  @ControlAuth('public')
  @UsePipes(new UrlPipe())
  async readFileUrlUpload(@Req() req: Request, @Query('imgUrl') imgUrl: string) {
    const allowedIps: string[] = ['::1', '127.0.0.1'];
    const allowed = allowedIps.some((ip) => req.ip.indexOf(ip) > -1);

    if (!allowed) {
      throw new BadRequestException('production mode not allowed');
    }

    try {
      // 从提供的URL下载图片
      const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });

      const ext = this.getImageFileExtension(imgUrl);
      const filename = this.formatPathTime(this.genUUID()) + ext;
      const res = await this.client.put(filename, response.data);
      return {
        url: res.url,
        name: filename,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private genUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private getImageFileExtension(url: string) {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    const nameParts = fileName.split('.');
    return nameParts.length > 1 ? '.' + nameParts[nameParts.length - 1] : '';
  }
}
