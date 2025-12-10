import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import type { Post as PostInterface } from 'src/interfaces/posts/posts.interface';
import { PostsService } from 'src/services/posts/posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostExistPipe } from 'src/pipes/post-exist/post-exist.pipe';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllWithQuery(@Query('search') search?: string): Promise<PostInterface[]>{
        const posts = await this.postsService.getAllPosts();
        if(search){
            return posts.filter(posts => posts.title.toLowerCase().includes(search.toLowerCase()) || posts.content.toLowerCase().includes(search.toLowerCase()));
        }
        return posts;
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getPostById(@Param('id', ParseIntPipe, PostExistPipe) id: number): Promise<PostInterface> {
        return await this.postsService.getPostById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() post: CreatePostDto): Promise<PostInterface> {
        return await this.postsService.createPost(post);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updatePost(@Param('id', ParseIntPipe, PostExistPipe) id,@Body() post: Partial<CreatePostDto>): Promise<PostInterface> {
        return await this.postsService.updatePost(id, post);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(@Param('id', ParseIntPipe) id: number): Promise<PostInterface> {
        return await this.postsService.deletePost(id);
    }
}
