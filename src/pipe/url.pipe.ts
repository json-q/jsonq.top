import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UrlPipe implements PipeTransform {
  transform(value: any) {
    if (!value) throw new BadRequestException('Image url is required');

    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      throw new BadRequestException('URL must start with http or https');
    }
    return value;
  }
}
