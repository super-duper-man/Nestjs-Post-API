import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from 'src/interfaces/posts/posts.interface';

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

    getAllPosts(): Post[] {
        return this.posts;
    }
    getPostById(id: number): Post {
        const post = this.posts.find(post => post.id === id);
        if (!post)
            throw new NotFoundException('پست مربوطه پیدا نشد');

        return post;
    }
    createPost(post: Omit<Post, 'id' | 'createdAt'>): Post {
        const newPost: Post = {
            id: this.getNextId(),
            createdAt: new Date(),
            ...post
        };
        this.posts.push(newPost);
        return newPost
    }
    updatePost(id: number, updatedPost: Partial<Post>): Post {
        const postIndex = this.posts.findIndex(post => post.id === id);
        this.posts[postIndex] = { ...this.posts[postIndex], ...updatedPost, updatedAt: new Date() };
        return this.posts[postIndex];
    }
    deletePost(id: number): void {
         const postIndex = this.posts.findIndex(post => post.id === id);
        if (postIndex < 0)
            throw new NotFoundException('پست مربوطه پیدا نشد');

        this.posts = this.posts.filter(post => post.id !== id);
    }

    private getNextId(): number {
        return this.posts.length > 0 ? Math.max(...this.posts.map(post => post.id)) + 1 : 1;
    }
}
