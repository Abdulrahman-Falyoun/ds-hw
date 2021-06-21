import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  createThumbnail,
  getFileMetadata,
} from '../../../libs/file-upload/src/helpers';
import { extname } from 'path';
import { Model } from 'mongoose';
import { IFile } from '../../../libs/file-upload/src';
import { DS_FILE_SCHEMA } from '../../schema-names';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class ImageHandlerService {
  constructor(
    @InjectModel(DS_FILE_SCHEMA) private readonly fileModel: Model<IFile>,
  ) {}

  largestFile(files: Express.Multer.File[]) {
    const sortedFiles = files.sort((f1, f2) => f1.size - f2.size);
    return sortedFiles[sortedFiles.length - 1];
  }

  async getMetadata(file: string) {
    return await getFileMetadata(file);
  }

  async resizeImage({
    image,
    opts,
  }: {
    image: Express.Multer.File;
    opts: { width: number; height: number };
  }) {
    try {
      console.log(`creating thumbnail`);
      await createThumbnail(image, +opts.width);
      console.log(`thumbnail created`);
      const metadata = await getFileMetadata(image.path);
      const createdFile = await this.fileModel.create({
        url: `http://localhost:${process.env.GATEWAY_PORT}/files/${image.filename}`,
        thumbnail: `http://localhost:${process.env.GATEWAY_PORT}/files/thumbnails/${image.filename}`,
        name: image.filename,
        originalName: image.originalname,
        mimetype: image.mimetype,
        size: image.size,
        dest: image.destination,
        height: metadata.height,
        width: metadata.width,
        ext: extname(image.originalname),
      });
      return {
        file: createdFile,
        message: 'File saved successfully',
      };
    } catch (e) {
      console.log('Resizing error: ', e.message || e);
      throw new BadRequestException({
        message: e.message || e,
      });
    }
  }
}
