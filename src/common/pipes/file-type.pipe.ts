import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export interface FileTypeOptions {
  allowedTypes: string[]; // 允许的文件类型
  allowedExtensions?: string[]; // 允许的文件扩展名
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
export class FileTypePipe implements PipeTransform {
  constructor(private options: FileTypeOptions) {}

  transform(file: MulterFile | undefined): MulterFile {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // 检查MIME类型
    if (this.options.allowedTypes && !this.options.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed. Allowed types: ${this.options.allowedTypes.join(', ')}`);
    }

    // 检查文件扩展名
    if (this.options.allowedExtensions) {
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      if (!fileExtension || !this.options.allowedExtensions.includes(fileExtension)) {
        throw new BadRequestException(`File extension .${fileExtension} is not allowed. Allowed extensions: ${this.options.allowedExtensions.join(', ')}`);
      }
    }

    return file;
  }
}
