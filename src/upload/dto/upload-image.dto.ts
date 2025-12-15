import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ảnh cần upload (tối đa 5MB, chỉ image/*)',
  })
  file!: any;
}

export class UploadImageResponseDto {
  @ApiProperty({
    example: 'uploads/123e4567-e89b-12d3-a456-426614174000.jpg',
    description: 'S3 object key',
  })
  key!: string;

  @ApiProperty({
    example:
      'https://my-bucket.s3.us-east-1.amazonaws.com/uploads/123e4567-e89b-12d3-a456-426614174000.jpg',
    description: 'Public URL của ảnh đã upload',
  })
  url!: string;
}

