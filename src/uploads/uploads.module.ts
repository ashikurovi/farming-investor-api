import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { BlobStorageService } from 'src/uploads/blob-storage.service';

@Global()
@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  providers: [BlobStorageService],
  exports: [MulterModule, BlobStorageService],
})
export class UploadsModule {}