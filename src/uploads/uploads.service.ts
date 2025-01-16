import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './entities/upload.entity';
import { FileTypes } from './enums/file-types.enum';
import { UploadFile } from './interfaces/upload-file.interface';
import { UploadToAwsProvider } from './providers/upload-to-aws.provider';

@Injectable()
export class UploadsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    if (
      !['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(
        file.mimetype,
      )
    )
      throw new BadRequestException('Mime type not supported');

    try {
      const name = await this.uploadToAwsProvider.fileUpload(file);

      const uploadFile: UploadFile = {
        name,
        path: `${this.configService.getOrThrow('AWS_CLOUDFRONT_URL')}/${name}`,
        type: FileTypes.IMAGE,
        mimeType: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
