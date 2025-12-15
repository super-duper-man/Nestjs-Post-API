import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { createPostCompositeDecorator } from 'src/decorators/posts.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { Post as PostInterface } from 'src/models/posts/posts.model';
import { PostExistPipe } from 'src/pipes/post-exist/post-exist.pipe';
import { PostsService } from 'src/services/posts/posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PaginatedResponse } from 'src/models/pagination-meta.model';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @ApiOperation({ summary: 'Get All Posts' })
  @ApiResponse({ status: 200 })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for filtering posts',
    type: String,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllWithQuery(
    @Query('search') search: string = '',
  ): Promise<PaginatedResponse<PostInterface>> {
    const posts = await this.postsService.getAllPosts({title: search});
    return posts;
  }

  @ApiOperation({ summary: 'Get post by id' })
  @ApiParam({ name: 'id', description: 'Post id' })
  @ApiResponse({ status: 200, description: 'Post returned' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPostById(
    @Param('id', ParseIntPipe, PostExistPipe) postId: number,
  ): Promise<PostInterface> {
    const { id, title, content } = await this.postsService.getPostById(postId);
    return { id, title, content };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create Post' })
  @ApiResponse({ status: 201 })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() post: CreatePostDto, @CurrentUser() user): Promise<PostInterface> {
    const { id, title, content, createdAt } = await this.postsService.createPost(post, user);
    return { id, title, content, createdAt };
  }

  @createPostCompositeDecorator({ apiOperationSummary: 'Update post by id', apiParamName: 'id', apiParamDescription: 'Post id', apiResponseStatus: 200, apiResponseDescription: 'Updated post returned' })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updatePost(
    @Param('id', ParseIntPipe, PostExistPipe) id,
    @Body() post: Partial<CreatePostDto>,
    @CurrentUser() user
  ): Promise<PostInterface> {
    return await this.postsService.updatePost(id, post, user);
  }

  @ApiOperation({ summary: 'Delete post by id' })
  @ApiParam({ name: 'id', description: 'Post id' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('id', ParseIntPipe) id: number, @CurrentUser() user
  ) {
    const post = await this.postsService.deletePost(id, user);
    return Boolean(post);
  }
}
