import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/entities/user.entity';
import { PaginatedResponse } from 'src/models/pagination-meta.model';
import { FindPost } from 'src/models/posts/find-post.model';
import { Post } from 'src/models/posts/posts.model';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { PostEntity } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
    private postListCacheKeys: Set<string> = new Set();

    constructor(@InjectRepository(PostEntity) private readonly postRepo: Repository<PostEntity>, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async getAllPosts(query: FindPost): Promise<PaginatedResponse<Post>> {
        const cacheKey = this.generatePostsListCacheKey(query);
        this.postListCacheKeys.add(cacheKey);

        const getCachedData = await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey);
        if (getCachedData) {
            console.log(`Cache Hit ======> Returning post list from cache: ${cacheKey}`);
            return getCachedData;
        }

        console.log(`Cache Miss ======> Returning post list from database`);
        const { page = 1, limit = 10, title } = query;
        const skip = (page - 1) * limit;

        const queryBuilder = this.postRepo.createQueryBuilder('post').leftJoinAndSelect('post.author', 'author').orderBy('post.createdAt', 'DESC').skip(skip).take(limit);

        if (title) {
            queryBuilder.andWhere('post.title LIKE :title', { title: `%${title}%` });
        }

        const [items, totalItems] = await queryBuilder.getManyAndCount();

        const totalPages = Math.ceil(totalItems / limit);

        const mappedItems: Post[] = items.map(({ id, title, content }) => ({
            id,
            title,
            content,
        }));

        const response: PaginatedResponse<Post> = {
            items: mappedItems,
            meta: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems,
                hasPreviousPage: page > 1,
                nextPage: page < totalPages
            }
        };

        await this.cacheManager.set(cacheKey, response, 30000);

        return response;
    }
    async getPostById(id: number): Promise<PostEntity> {
        const post = await this.postRepo.findOne({ where: { id }, relations: ['author'] });
        if (!post)
            throw new NotFoundException('پست مربوطه پیدا نشد');

        return post;
    }
    async createPost(post: CreatePostDto, author: UserEntity): Promise<PostEntity> {
        const newPost = this.postRepo.create({
            title: post.title,
            content: post.content,
            author
        });

        return await this.postRepo.save(newPost);
    }
    async updatePost(id: number, updatedPost: Partial<CreatePostDto>, user: UserEntity): Promise<Post> {
        const post = await this.getPostById(id);

        this.checkCorrespondUser(post.author, id);

        const updatePost = Object.assign(post, updatedPost);

        await this.postRepo.save(updatePost);

        return updatePost;
    }
    async deletePost(id: number, user: UserEntity): Promise<PostEntity> {
        const post = await this.getPostById(id);

        this.checkCorrespondUser(post.author, user.id);

        return await this.postRepo.remove(post);
    }

    private checkCorrespondUser(user: UserEntity, id: number): void {
        if (user.id !== id)
            throw new ForbiddenException('این پست مطعلق به کاربر مربوطه نمی‌باشد');
    }

    private generatePostsListCacheKey(query: FindPost): string {
        const { page = 1, limit = 10, title } = query;
        return `posts_list_page${page}_limit${limit}_title${title || 'all'}`;
    }
}
