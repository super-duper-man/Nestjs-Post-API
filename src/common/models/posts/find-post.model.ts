import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationDto } from "../pagination-dto.model";

export class FindPost extends PaginationDto {
    @IsOptional()
    @IsString({message: 'Title must be a string'})
    @MaxLength(100, {message: 'Title search cannot exceed 100 characters'})
    title?: string
}