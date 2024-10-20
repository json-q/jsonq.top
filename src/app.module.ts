// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import envConfig from './config/env';

@Module({
  imports: [
    AuthModule,
    OssModule,
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }),
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
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
        secret: configService.get('jwt.secret'),
      }),
    }),
    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 1000,
    //     limit: 1000,
    //   },
    // ]),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => [
        {
          ttl: configService.get('throttler.ttl'),
          limit: configService.get('throttler.limit'),
        },
      ],
    }),
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
