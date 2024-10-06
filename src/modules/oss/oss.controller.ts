import {
  Controller,
  FileTypeValidator,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as OSS from 'ali-oss';
import { RequestGuard } from '@/guard/request.guard';

@Controller('oss')
@UseGuards(RequestGuard)
export class OssController {
  private readonly client: OSS;

  constructor(private readonly configService: ConfigService) {
    this.client = new OSS({
      region: this.configService.get('Region'),
      accessKeyId: this.configService.get('AccessKeyID'),
      accessKeySecret: this.configService.get('AccessKeySecret'),
      bucket: this.configService.get('Bucket'),
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async findAll(
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
    const now = new Date();
    const dest = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
    const filename = dest + '/' + this.formatTime(now) + '_' + file.originalname;
    try {
      const res = await this.client.put(filename, file.buffer, {
        mime: file.mimetype,
      });
      return {
        url: res.url,
        name: file.originalname,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  private formatTime(date: Date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${hours}${minutes}${seconds}${milliseconds}`;
  }
}
