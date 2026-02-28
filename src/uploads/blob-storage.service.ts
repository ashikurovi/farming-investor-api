import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { put } from '@vercel/blob';
import * as Express from 'express';

@Injectable()
export class BlobStorageService {
  private readonly logger = new Logger(BlobStorageService.name);

  async uploadUserPhoto(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      throw new InternalServerErrorException('No file buffer provided for upload');
    }

    try {
      const blob = await put(
        `uploads/photos/${Date.now()}-${file.originalname}`,
        file.buffer,
        {
          access: 'public',
          addRandomSuffix: true,
          token: 'vercel_blob_rw_UWXMYKXOXviIXovH_uPqlndwmUlLFGBHzTUofVwks4i2yN5',
        },
      );

      return blob.url;
    } catch (error: any) {
      this.logger.error('Failed to upload file to Vercel Blob', error?.stack || error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}

