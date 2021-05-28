import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createThumbnail, getImageDimensions } from '../../../libs/file-upload/src/helpers';
import {  extname } from "path";
import { Model } from 'mongoose';
import { IFile } from '../../../libs/file-upload/src';
import { DS_FILE_SCHEMA } from '../../schema-names';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ImageHandlerService {

  constructor(@InjectModel(DS_FILE_SCHEMA) private readonly fileModel: Model<IFile>) {
  }
  async takeScreenshot(website: string) {
    return `screenshot for ${website}`;
  }


  async resizeImage({ image, opts }: { image: Express.Multer.File; opts: { width: number, height: number } }) {
    try {
      await createThumbnail(image, +opts.width);
      const metadata = await getImageDimensions(image.path);
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
