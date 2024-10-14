// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { join } from 'path';

// import { IpMiddleware } from './middleware/ip.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { OssModule } from './modules/oss/oss.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    OssModule,
    // local config don't commit to git
    ConfigModule.forRoot({ envFilePath: ['.env.local', '.env'], isGlobal: true }),
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'client'),
        serveRoot: '/client',
      },
      {
        rootPath: join(__dirname, '..', 'client/favicon.ico'),
        serveRoot: '/favicon.ico',
      },
    ),
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '30m',
      },
      secret: '7accdc82bd754d6da1888c73b9801b9e',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 3,
      },
    ]),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        level: 'debug',
        transports: [
          new winston.transports.DailyRotateFile({
            level: 'debug',
            dirname: 'logs',
            filename: 'log-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '1M',
          }),
          new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
          }),
        ],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(IpMiddleware).forRoutes('*');
//   }
// }
