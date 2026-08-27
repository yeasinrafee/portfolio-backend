/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CLOUDINARY } from './cloudinary.provider';

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private readonly cloudinaryClient: any) {}

  uploadBuffer(
    buffer: Buffer,
    options: { folder: string; resourceType: 'image' | 'raw' | 'auto' },
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryClient.uploader.upload_stream(
        { folder: options.folder, resource_type: options.resourceType },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error)
            return reject(
              new InternalServerErrorException(
                `Cloudinary upload failed: ${error.message}`,
              ),
            );
          resolve(result);
        },
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  async deleteFile(
    publicId: string,
    resourceType: 'image' | 'raw' = 'image',
  ): Promise<void> {
    try {
      await this.cloudinaryClient.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete file: ${(error as Error).message}`,
      );
    }
  }
}
