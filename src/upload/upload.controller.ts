import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBadRequestResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import type { Express } from 'express';
import { UploadService } from './upload.service';
import {
  UploadImageDto,
  UploadImageResponseDto,
} from './dto/upload-image.dto';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload ảnh lên S3' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Upload thành công',
    type: UploadImageResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Thiếu file hoặc file không phải hình ảnh',
  })
  // Schema multipart sẽ được mô tả qua DTO (file binary)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap to protect the API.
      fileFilter: (req, file, cb) => {
        // Only allow common image MIME types.
        if (!file.mimetype?.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<UploadImageResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // Delegate the S3 write to the service; returns key + public URL.
    return this.uploadService.uploadImage(file);
  }
}

