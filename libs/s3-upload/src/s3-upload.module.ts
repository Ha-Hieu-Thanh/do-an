import { Module } from '@nestjs/common';
import { LibraryS3UploadService } from './s3-upload.service';
import { ConfigurableModuleClass } from './s3-upload.module-definition';

@Module({
  providers: [LibraryS3UploadService],
  exports: [LibraryS3UploadService],
})
export class LibraryS3UploadModule extends ConfigurableModuleClass {}
