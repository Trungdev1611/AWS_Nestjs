import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { Express } from 'express';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

@Injectable()
export class UploadService {
  // Create one S3 client for the service lifetime; re-use across requests.
  private readonly s3 = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    },
  });

  async uploadImage(file: Express.Multer.File) {
    const bucket = process.env.AWS_S3_BUCKET;
    const prefix = process.env.AWS_S3_PREFIX ?? '';

    if (!bucket) {
      throw new InternalServerErrorException('Missing AWS_S3_BUCKET');
    }

    // Generate unique key per upload; keep original extension.
    const key = `${prefix}${prefix ? '/' : ''}${randomUUID()}${extname(file.originalname)}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (err) {
      // Wrap AWS errors to avoid leaking details to clients.
      throw new InternalServerErrorException('Failed to upload to S3');
    }

    const url = `https://${bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
    return { key, url };
  }
}

