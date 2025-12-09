import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import type { Post as PostInterface } from 'src/interfaces/posts/posts.interface';
import { PostsService } from 'src/services/posts/posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    getAllWithQuery(@Query('search') search?: string): PostInterface[]{
        const posts = this.postsService.getAllPosts();
        if(search){
            return posts.filter(posts => posts.title.toLowerCase().includes(search.toLowerCase()) || posts.content.toLowerCase().includes(search.toLowerCase()));
        }
        return posts;
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    getPostById(@Param('id', ParseIntPipe) id: number): PostInterface {
        return this.postsService.getPostById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    createPost(@Body() post: CreatePostDto): PostInterface {
        return this.postsService.createPost(post);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    updatePost(@Param('id', ParseIntPipe) id,@Body() post: Partial<CreatePostDto>): PostInterface {
        return this.postsService.updatePost(id, post);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deletePost(@Param('id', ParseIntPipe) id: number): void {
        this.postsService.deletePost(id);
    }
}
