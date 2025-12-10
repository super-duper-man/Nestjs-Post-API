import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/interfaces/posts/posts.interface';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { PostEntity } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
    private posts: Post[] = [
        {
            id: 1,
            title: 'First Post',
            content: 'This is the content of the first post.',
            author: 'Alice',
            createdAt: new Date('2024-01-01T10:00:00Z'),
        },
        {
            id: 2,
            title: 'Second Post',
            content: 'This is the content of the second post.',
            author: 'Bob',
            createdAt: new Date('2024-01-02T11:00:00Z'),
        },
    ];

    constructor(@InjectRepository(PostEntity) private readonly postRepo: Repository<PostEntity>) { }

    async getAllPosts(): Promise<Post[]> {
        const posts = await this.postRepo.find();
        return posts;
    }
   async getPostById(id: number): Promise<Post> {
        const post = await this.postRepo.findOneBy({id});
        if (!post)
            throw new NotFoundException('پست مربوطه پیدا نشد');

        return post;
    }
   async createPost(post: CreatePostDto): Promise<Post> {
        const newPost = this.postRepo.create({
            title: post.title,
            author: post.author,
            content: post.content,
        });

        return await this.postRepo.save(newPost);
    }
   async updatePost(id: number, updatedPost: Partial<CreatePostDto>): Promise<Post> {
       const post = await this.postRepo.findOne({where: {id}});
       if(!post)
        throw new NotFoundException('پست مربوطه پیدا نشد');

       const updatePost = Object.assign(post, updatedPost);

       await this.postRepo.save(updatePost);

       return updatePost;
    }
    async deletePost(id: number): Promise<Post> {
        const post = await this.postRepo.findOne({where: {id}});
        if (!post)
            throw new NotFoundException('پست مربوطه پیدا نشد');

        return await this.postRepo.remove(post);
    }
}
