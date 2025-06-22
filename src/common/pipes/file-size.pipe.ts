import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export interface FileSizeOptions {
  maxSize: number; // 最大文件大小（字节）
  minSize?: number; // 最小文件大小（字节）
}

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Injectable()
export class FileSizePipe implements PipeTransform {
  constructor(private options: FileSizeOptions) {}

  transform(file: MulterFile | undefined): MulterFile {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileSize = file.size;

    if (fileSize > this.options.maxSize) {
      const maxSizeMB = this.options.maxSize / (1024 * 1024);
      throw new BadRequestException(`File size exceeds maximum limit of ${maxSizeMB}MB`);
    }

    if (this.options.minSize && fileSize < this.options.minSize) {
      const minSizeKB = this.options.minSize / 1024;
      throw new BadRequestException(`File size is below minimum limit of ${minSizeKB}KB`);
    }

    return file;
  }
}
