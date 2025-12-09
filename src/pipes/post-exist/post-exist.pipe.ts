import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { PostsService } from 'src/services/posts/posts.service';

@Injectable()
export class PostExistPipe implements PipeTransform {
  constructor(private readonly postsService: PostsService){}
  transform(value: number, metadata: ArgumentMetadata) {

    try {
      this.postsService.getPostById(value)
    } catch (error) {
      throw new NotFoundException(`پست مربوطه یافت نشد`)
    }
    return value;
  }
}
