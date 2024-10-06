import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor';
import * as cookiePareser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor(), new InvokeRecordInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(cookiePareser());

  await app.listen(3000, () => {
    console.log('server running in http://localhost:3000');
  });
}
bootstrap();
