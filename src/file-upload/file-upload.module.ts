import { Module } from '@nestjs/common';
import { FileUploadController } from './controllers/file-upload.controller';

@Module({
  controllers: [FileUploadController]
})
export class FileUploadModule {}
