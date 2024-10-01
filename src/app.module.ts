import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { RequestContextModule } from 'nestjs-request-context';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        quietReqLogger: true,
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-http-print',
                options: {
                  all: true,
                  translateTime: true,
                  relativeUrl: true,
                },
              }
            : undefined,
      },
    }),
    RequestContextModule,
    CommonModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
