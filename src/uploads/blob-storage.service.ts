import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { put } from '@vercel/blob';
// Avoid Express.Multer typing to prevent build issues with Express v5 types

@Injectable()
export class BlobStorageService {
  private readonly logger = new Logger(BlobStorageService.name);

  async uploadUserPhoto(file: any): Promise<string> {
    return this.upload(file, 'uploads/photos');
  }

  async uploadBannerPhoto(file: any): Promise<string> {
    return this.upload(file, 'uploads/banners');
  }

  async uploadProjectImage(file: any): Promise<string> {
    return this.upload(file, 'uploads/projects');
  }

  async uploadGlarryPhoto(file: any): Promise<string> {
    return this.upload(file, 'uploads/glarry');
  }

  private async upload(file: any, prefix: string): Promise<string> {
    if (!file || !file.buffer) {
      throw new InternalServerErrorException(
        'No file buffer provided for upload',
      );
    }

    try {
      const blob = await put(
        `${prefix}/${Date.now()}-${file.originalname}`,
        file.buffer,
        {
          access: 'public',
          addRandomSuffix: true,
          token:
            'vercel_blob_rw_NitJ1UUEWJXyZ7XZ_9arbdpBPE6Blu6gXt5HVZkacF1QBux',
        },
      );

      return blob.url;
    } catch (error: any) {
      this.logger.error(
        'Failed to upload file to Vercel Blob',
        error?.stack || error,
      );
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}
