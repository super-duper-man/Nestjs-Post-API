import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import Joi, * as joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './posts/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './auth/entities/user.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { FileUploadModule } from './file-upload/file-upload.module';
import { FileUploadService } from './services/file-upload/file-upload.service';
import { EventsModule } from './events/events.module';
import { UserEventService } from './services/user-event/user-event.service';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        APP_NAME: joi.string().default('NestJS Application'),
      }),
      //load: [appConfig],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 50 }]),
    CacheModule.register({
      isGlobal: true,
      ttl: 30000
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: '123',
      port: 5432,
      database: 'Nestjs-Posts',
      entities: [PostEntity, UserEntity],
      synchronize: true,
    }),
    UserModule,
    PostsModule,
    AuthModule,
    FileUploadModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileUploadService, UserEventService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
