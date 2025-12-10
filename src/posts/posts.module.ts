import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from 'src/services/posts/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity])
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
